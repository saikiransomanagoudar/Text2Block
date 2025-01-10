import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import re
import cv2
from graphviz import Source

load_dotenv()


class GrokHandler:
    def __init__(self, model_name="llama-3.3-70b-versatile"):
        """
        Initializes the GrokHandler with the specified Groq model.
        """
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable not set.")

        # Initialize Groq LLM client
        self.llm = ChatGroq(groq_api_key=self.groq_api_key, model_name=model_name)
        self.model_name = model_name

    def generate_dot_code(self, user_prompt):
        """
        Generate DOT code for a flowchart based on the user's query.
        :param user_prompt: Prompt provided by the user.
        :return: Refined DOT code for the flowchart.
        """
        prompt = (
            f"You are a personal teaching assistant responsible for generating DOT language code to help users understand complex topics. "
            f"The DOT code must create clear and visually appealing flowcharts that simplify learning and effectively convey the concepts to the user. "

            f"Based on the following query, generate DOT language code:\n\n"
            f"The User Query is : {user_prompt} \n\n"
            f"Follow these **guidelines** while generating the DOT code:\n\n"
            f"1. Begin the DOT code with [resolution=900] to ensure high resolution.\n"
            f"2. STRICTLY The graph name **must not** contain spaces, but node and edge names may include spaces."
            f"  - for example [digraph MDSembeddingsplot] is right way of naming a graph, but not [digraph MDS embeddings plot]\n"
            f"3. The dot code MUST contain digraph or graph or any type of graph available in GRAPHVIZ library suitable to the user query "
            f"4. You can follow different layouts [dot, neato, dfp, sfdp, circo, twopi, osage and patchwork] whichever suitable to User Query in the dot code: \n"
            f"5. Use valid Graphviz-supported or custom hexadecimal colors (\"#4CAF50\") with good text contrast.\n"
            f"6. If color not specified in user query, use pastel colors for flowchart elements with good text contrast to ensure readability.\n"
            f"7. Validate the DOT code to ensure it complies with Graphviz syntax and avoid reserved keywords or invalid node names and ensure the resolution is set to 1300 in the beginning of the code. \n"
            f"This is the example structure you can follow for the parameters to include in the start of the code:\n"
            f"digraph nameofgraph {{resolution = 1300 layout= circo; rest of the code}}"
            f"8. If the input cannot be expressed in a flowchart (e.g., typos or meaningless queries), generate a DOT flowchart with one square box containing:\n"
            f"   [It seems like there might have been a typo or error. Please elaborate your requirement for better understanding.]\n"
            f"9. For unethical queries, generate a DOT flowchart with one square box containing:\n"
            f"   [I'm sorry, I can't assist with that request. It is unethical to do such practices.]\n"
            f"10. The output should only be DOT CODE, STRICTLY Avoid preamble, unnecessary comments, or extraneous symbols,  \n\n"

        )

        # Query the Groq LLM client
        response = self.llm.invoke(prompt)

        # Extract the response
        dot_code = response.content.strip()

        # Extract and validate DOT code
        try:
            if "digraph" in dot_code:
                dot_code_start = dot_code.find("digraph")
                dot_code = dot_code[dot_code_start:].strip()
            elif "graph" in dot_code:
                dot_code_start = dot_code.find("graph")
                dot_code = dot_code[dot_code_start:].strip()
            else:
                raise ValueError("Generated DOT code does not contain 'digraph' or 'graph'.")

            # Cleanup DOT code
            dot_code = re.sub(r"[^a-zA-Z0-9\s\-\->;{}\"\[\]=#\+\-\*/\^%()]", " ", dot_code)

        except ValueError as e:
            raise ValueError(f"Error in generating DOT code: {e}")

        return dot_code

    def validate_and_render_dot_code(self, dot_code, output_file="flowchart"):
        """
        Validate and render the DOT code. Use LLM to fix errors if encountered.
        :param dot_code: The initial DOT code.
        :return: Path to the successfully rendered image.
        """
        max_retries = 5
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
            f"Your task is to fix the errors in the dot code and generate a error free dot code, while making sure it can render successfully as a flowchart. \n"
            f"The dot code is: \n {dot_code} \n"
            f"is showing this Error message: {error_message} \n"
            f"Please follow the below guidelines while generating the corrected code:"
            f"1. Firstly find the issues with given dot code and correct them. \n"
            f"2. Make sure the given Error message is rectified and name of the graph is not having spaces .\n"
            f" for example [digraph MDSembeddingsplot] is right way of naming a graph, but not [digraph MDS embeddings plot]\n"
            f"3. If node or edge names include spaces, enclose them in double quotes to avoid syntax errors. "
            f"   - For example: [node1 -> \"Node With Spaces\"] is valid.\n"
            f"4. Set the resolution of DOT code as 1300 [resolution=1300] in the beginning of the code "
            f"5. Make sure the corrected dot code carries the similar information as the original dot code carried. \n"
            f"6. The dot code MUST contain digraph or graph or a suitable type of graph suitable to the dot code. \n"
            f"7. Validate the DOT code to ensure it complies with Graphviz syntax and avoid reserved keywords or invalid node names (e.g., do not use 'subgraph' as a node name unless it is meant to represent a subgraph).\n"
            f" - If a reserved term is used incorrectly, suggest an alternative or provide a corrected version.\n"
            f"   Example: If 'subgraph' is used as a node name, rename it to avoid conflicts or use proper subgraph syntax.\n"
            # f"4. STRICTLY set the resolution to be 1300 in starting of the DOT code to ensure the rendered flow chart is having high resolution like this [resolution=1300].\n"
            f"8. STRICTLY NO PREAMBLE OR UNNECESSARY COMMENTS. \n"
        )

        # Query the Groq LLM client for fixing DOT code
        response = self.llm.invoke(prompt)

        dot_code = response.content.strip()

        # Extract and validate DOT code
        try:
            if "digraph" in dot_code:
                dot_code_start = dot_code.find("digraph")
                dot_code = dot_code[dot_code_start:].strip()
            elif "graph" in dot_code:
                dot_code_start = dot_code.find("graph")
                dot_code = dot_code[dot_code_start:].strip()
            else:
                raise ValueError("Generated DOT code does not contain 'digraph' or 'graph'.")

            # Cleanup DOT code
            dot_code = re.sub(r"[^a-zA-Z0-9\s\-\->;{}\"\[\]=#\+\-\*/\^%()]", " ", dot_code)

        except ValueError as e:
            raise ValueError(f"Error in generating DOT code: {e}")

        return dot_code

    def generate_text_response(self, dot_code, user_prompt):
        """
        Generate a textual explanation of the rendered flowchart based on the DOT code.
        :param dot_code: The validated and compiled DOT code.
        :return: Textual explanation generated by the LLM.
        """
        prompt = (
            f"Your task is to generate a text response that provides a thorough understanding of the flowchart rendered by the dot code in context of user prompt:\n"
            f"Input Dot Code: {dot_code}\n"
            f"Input User Prompt: {user_prompt}\n"
            f"Flow chart: This is rendered by the input Dot Code using Graphviz source function"
            f"Follow the below instructions while drafting the text response: \n"
            f"1. Write a detail, logical explanation of the Flowchart in bullet points while aligning the response with User Prompt,"
            f" ensuring the reader thoroughly understands the process as per his requirement. \n"
            f"2. If not mentioned in the user prompt, do not exceed the response by 450 words. \n"
            f"3. When different colors used in the flowchart, you can explain the color coding with human understandable language like orange instead of #45923 [hexadecimal coding] "
            f"4. Avoid preambles or unnecessary introductory text. Start directly with the explanation.\n"
            f"5. If the user prompt AND dot code gives a meaning like this [I'm sorry, I can't assist with that request, It is unethical to do such practices] "
            f" Only then give a generic response stating ['I can not assist you with this']. \n"
            f"6. If the user prompt AND dot code gives a meaning like this [ It seems like there might have been a typo or error]."
            f"Only then give a generic response stating[ Please elaborate your requirement for better understanding] "
        )

        # Query the Groq LLM client
        response = self.llm.invoke(prompt)

        return response.content.strip()

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
