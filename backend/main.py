from flask import Flask, request, jsonify
from flask_cors import CORS
#from groq_handler import GrokHandler
#from openrouter_llms import QueryHandler
from router_groq_llms import GrokHandler
import base64
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        # Get the prompt from the request
        data = request.json
        user_prompt = data.get('prompt')
        
        if not user_prompt:
            return jsonify({'error': 'No prompt provided'}), 400

        # Initialize the GrokHandler
        query_handler = GrokHandler()
       
        # Step 1: Generate DOT code
        dot_code = query_handler.generate_dot_code(user_prompt)

        # Step 2: Validate and render the flowchart
        output_image_path = query_handler.validate_and_render_dot_code(
            dot_code,
            output_file="flowchart"
        )

        # Step 3: Generate textual explanation
        explanation = query_handler.generate_text_response(dot_code, user_prompt)

        # Step 4: Read and encode the image
        with open(output_image_path, "rb") as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode()

        if os.path.exists(output_image_path):
            os.remove(output_image_path)
        if os.path.exists(output_image_path + ".jpeg"):
            os.remove(output_image_path + ".jpeg")

        return jsonify({
            'flowchart': encoded_image,
            'explanation': explanation
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)