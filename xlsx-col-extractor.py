import pandas as pd
import tkinter as tk
from tkinter import filedialog

root = tk.Tk()
root.withdraw()

# Ask the user to select an Excel file using a file dialog
print("Hey! Open an \033[92m.xlsx\033[0m file to start!")
file_path = filedialog.askopenfilename(title="Select Excel File", filetypes=[("Excel Files", "*.xlsx")])

if file_path:
    print(f"\033[92mSuccessfully opened .xlsx file at {file_path}\033[0m, please wait...")
# Check if the user canceled the dialog
if not file_path:
    print("No Excel file selected. Exiting.")
else:
    try:
        # Read the Excel file to get the sheet names
        xls = pd.ExcelFile(file_path)
        sheet_names = xls.sheet_names

        while True:
            # List the available sheets in the Excel file
            print("Available sheets in the Excel file:")
            for idx, sheet in enumerate(sheet_names):
                print(f"{idx + 1}. {sheet}")

            # Ask the user to choose a sheet
            selected_sheet_index = int(input("\033[94mEnter the sheet number (e.g., 1): \033[0m")) - 1

            if 0 <= selected_sheet_index < len(sheet_names):
                selected_sheet = sheet_names[selected_sheet_index]

                # Read the selected sheet using pandas
                df = pd.read_excel(xls, sheet_name=selected_sheet)

                while True:
                    # List the available column names in the selected sheet
                    column_names = df.columns
                    print(f"Available columns in the sheet '{selected_sheet}':")
                    for idx, column in enumerate(column_names):
                        print(f"{idx + 1}. {column}")

                    # Ask the user to choose a column
                    selected_column_index = int(input("\033[94mEnter the column number (e.g., 1): \033[0m")) - 1

                    if 0 <= selected_column_index < len(column_names):
                        selected_column = column_names[selected_column_index]

                        # Ask the user for the save location using a file dialog
                        output_file = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=[("Text Files", "*.txt")])

                        # Check if the user canceled the dialog
                        if not output_file:
                            print("\033[91mNo file selected for saving. Exiting.\033[0m")
                        else:
                            # Extract the selected column data and write non-empty cells to the selected text file
                            with open(output_file, "w") as file:
                                for item in df[selected_column]:
                                    if pd.notna(item):  # Check if the cell is not empty
                                        file.write(str(item) + "\n")

                            print(f"\033[92mContents of column '{selected_column}' from '{file_path}' (sheet '{selected_sheet}') have been extracted and saved to '{output_file}'.\033[0m")
                        break
                    else:
                        print("\033[91mInvalid column number selected. Please try again.\033[0m")
                break
            else:
                print("\033[91mInvalid sheet number selected. Please try again.\033[0m")

    except Exception as e:
        print(f"\033[91mAn error occurred: {str(e)}\033[0m")

root.destroy()