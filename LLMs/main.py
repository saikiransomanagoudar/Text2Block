#from query_handler import QueryHandler
from groq_handler import QueryHandler
def main():
    """
    Main function to handle user query, generate DOT code,
    render a flowchart, and generate a textual explanation.
    """
    # Initialize the QueryHandler
    query_handler = QueryHandler()

    while True:
        # Get the user query from the command line
        user_prompt = input("Enter your query (or type 'exit' to quit): ")

        if user_prompt.lower() == 'exit':
            print("Exiting the program...")
            break  # Exit the loop if the user types 'exit'

        try:
            # Step 1: Generate DOT code
            print("\nGenerating DOT code for the flowchart...")
            dot_code = query_handler.generate_dot_code(user_prompt)
            print("\nDOT Code:")
            print(dot_code)

            # Step 2: Validate and render the flowchart
            print("\nValidating and rendering the flowchart...")
            output_image_path = query_handler.validate_and_render_dot_code(
                dot_code,
                output_file="D:/Projects/BlockAI/Flowchart_responses/flowchart"
            )
            print(f"\nFlowchart saved as: {output_image_path}")

            # Step 3: Display the flowchart
            #query_handler.display_flowchart(output_image_path)

            # Step 4: Generate textual explanation
            print("\nGenerating textual explanation for the rendered flowchart...")
            explanation = query_handler.generate_text_response(dot_code)
            print("\nTextual Explanation:")
            print(explanation)

            # After generating and displaying the flowchart, ask if the user wants to continue
            continue_search = input("\nWould you like to search again? (yes/no): ").lower()
            if continue_search != 'yes':
                print("Exiting the program...")
                break  # Exit if the user doesn't want to continue

        except Exception as e:
            print(f"An error occurred: {e}")
            break  # Exit the loop if there's an error

if __name__ == "__main__":
    main()
