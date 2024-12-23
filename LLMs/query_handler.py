from openai import OpenAI
from dotenv import load_dotenv
import os
from graphviz import Source
import cv2
import re

load_dotenv()

class QueryHandler:
    def __init__(self, model_name="gpt-4o-mini"):
        """
        Initializes the QueryHandler with the specified OpenAI model.
        """
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if not self.openai_api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set.")

        # Initialize OpenAI client
        self.client = OpenAI(api_key=self.openai_api_key)
        self.model_name = model_name

    def generate_dot_code(self, user_prompt):
        """
        Generate DOT code for a flowchart based on the user's query.
        :param user_prompt: Prompt provided by the user.
        :return: Refined DOT code for the flowchart.
        """
        prompt = (
            f"You are a personal teaching assistant responsible for generating DOT language code to help users understand complex topics. "
            f"The DOT code must create clear and visually appealing flowcharts that simplify learning and effectively convey the concepts to the user."
            f"Based on the following query, generate DOT language code "
          #  f"to represent it as a flowchart:\n\n"
            f"query = {user_prompt}\n\n"
            f"Ensure the following: "
            #f"1. All multi-word labels and node names are enclosed in double quotes. "
            #f"2. Use valid Graphviz syntax. For example, if a label contains spaces, it should be enclosed in double quotes: 'SVD Image Compression' -> \"SVD Image Compression\"."
            f"1. The node names should not contain spaces. If the node name consists of multiple words, combine them into a single word without spaces (e.g., 'RandomVariablesAndPDF' instead of 'Random Variables and PDF'). "
            f"2. Ensure all colors used in the flowchart are valid Graphviz-supported colors, and for custom colors, STRICTLY use proper hexadecimal color codes PREFIXED WITH '#' (e.g., #4CAF50)."
            #f"Ensure all colors used in the flowchart are valid Graphviz-supported colors. For custom colors, STRICTLY use proper hexadecimal color codes PREFIXED WITH '#' (e.g., #4CAF50). "
            f"3. Ensure the colors chosen are contrast to the font color, so that the text is readable clearly"
            f"4. The flowchart must include clear nodes and edges, with visually appealing and readable styles."
            f"5. STRICTLY NO PREAMBLE OR UNNECESSARY COMMENTS."
        )

        # Query the OpenAI client
        completion = self.client.chat.completions.create(
            model=self.model_name,
            messages=[{"role": "system", "content": "You are a helpful assistant."},
                      {"role": "user", "content": prompt}]
        )

        # Extract the response
        response = completion.choices[0].message.content.strip()

        # Extract and validate DOT code
        try:
            if "digraph" in response:
                dot_code_start = response.find("digraph")
                dot_code = response[dot_code_start:].strip()
            elif "graph" in response:
                dot_code_start = response.find("graph")
                dot_code = response[dot_code_start:].strip()
            else:
                raise ValueError("Generated DOT code does not contain 'digraph' or 'graph'.")

            # Cleanup DOT code
            #dot_code = re.sub(r"[^a-zA-Z0-9\s\-\->;{}\"\[\]=#]", "", dot_code)
            #dot_code = re.sub(r'([()])', r'\\\1', dot_code)
            dot_code = re.sub(r"[^a-zA-Z0-9\s\-\->;{}\"\[\]=#\+\-\*/\^%()]", " ", dot_code)
            # Ensure proper quoting of multi-word labels or node names
            #dot_code = re.sub(r"([A-Za-z0-9_]+ [A-Za-z0-9_]+)", r'"\1"', dot_code)
        except ValueError as e:
            raise ValueError(f"Error in generating DOT code: {e}")

        return dot_code

    def validate_and_render_dot_code(self, dot_code, output_file="flowchart"):
        """
        Validate and render the DOT code. Use LLM to fix errors if encountered.
        :param dot_code: The initial DOT code.
        :return: Path to the successfully rendered image.
        """
        max_retries = 3
        for attempt in range(max_retries):
            try:
                # Render the flowchart
                graphviz_path = r"C:\Program Files\Graphviz\bin"  # Adjust to your Graphviz installation path
                os.environ["PATH"] += os.pathsep + graphviz_path

                src = Source(dot_code, format="jpeg", engine="dot")
                output_path = src.render(output_file, cleanup=True)
                return output_path
            except Exception as e:
                if attempt < max_retries - 1:
                    print(f"Render attempt {attempt + 1} failed. Sending error to LLM...")
                    dot_code = self.fix_dot_code(dot_code, str(e))
                else:
                    raise RuntimeError(f"DOT code validation failed after {max_retries} attempts. Error: {e}")

    def fix_dot_code(self, dot_code, error_message):
        """
        Use LLM to fix the DOT code based on the error message.
        :param dot_code: The erroneous DOT code.
        :param error_message: The error message encountered.
        :return: Fixed DOT code.
        """
        prompt = (
            f"The following DOT code caused an error during compilation:\n\n{dot_code}\n\n"
            f"Error message: {error_message}\n\n"
            f"Please fix the DOT code so it can render successfully as a flowchart."
            f"STRICTLY NO PREAMBLE OR UNNECESSARY COMMENTS."
        )

        # Query the OpenAI client for fixing DOT code
        completion = self.client.chat.completions.create(
            model=self.model_name,
            messages=[{"role": "system", "content": "You are a helpful assistant."},
                      {"role": "user", "content": prompt}]
        )

        response = completion.choices[0].message.content.strip()
        # Extract and validate DOT code
        try:
            if "digraph" in response:
                dot_code_start = response.find("digraph")
                dot_code = response[dot_code_start:].strip()
            elif "graph" in response:
                dot_code_start = response.find("graph")
                dot_code = response[dot_code_start:].strip()
            else:
                raise ValueError("Generated DOT code does not contain 'digraph' or 'graph'.")

            # Cleanup DOT code
            dot_code = re.sub(r"[^a-zA-Z0-9\s\-\->;{}\"\[\]=#]", "", dot_code)
            #dot_code = re.sub(r"[^a-zA-Z0-9\s\-\->;{}\"\[\]=#\+\-\*/\^%()]", " ", dot_code)

        except ValueError as e:
            raise ValueError(f"Error in generating DOT code: {e}")

        return dot_code


    def generate_text_response(self, dot_code):
        """
        Generate a textual explanation of the rendered flowchart based on the DOT code.
        :param dot_code: The validated and compiled DOT code.
        :return: Textual explanation generated by the LLM.
        """
        prompt = (
            f"Based on the following DOT code for a flowchart, generate a brief textual explanation (under 200 words):\n\n{dot_code}\n\n"
            f"The explanation should clearly describe each stage of the flowchart in a concise and logical manner in bullet points, highlighting key components, relationships, and processes."
            f"The written explanation should be clear to understand the flowchart generated by the Dot code"
        )

        # Query the OpenAI client
        completion = self.client.chat.completions.create(
            model=self.model_name,
            messages=[{"role": "system", "content": "You are a helpful assistant."},
                      {"role": "user", "content": prompt}]
        )

        return completion.choices[0].message.content.strip()

    def display_flowchart(self, image_path):
        """
        Display the generated flowchart image using OpenCV.
        :param image_path: Path to the flowchart image file.
        """
        image = cv2.imread(image_path)
        if image is None:
            raise FileNotFoundError(f"Image file {image_path} not found.")

        # Display the image in a window
        cv2.imshow("Generated Flowchart", image)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

