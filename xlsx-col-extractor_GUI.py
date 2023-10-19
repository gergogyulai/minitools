import pandas as pd
import tkinter as tk
import datetime
import threading
import sv_ttk
from tkinter import filedialog
from tkinter import ttk
from tkinter.scrolledtext import ScrolledText


def extract_and_save_column():
    file_path = filedialog.askopenfilename(title="Select Excel File", filetypes=[("Excel Files", "*.xlsx")])
    
    if file_path:
        loading_label.config(text="Loading... Please wait.")
        extract_button.config(state=tk.DISABLED)  # Disable the button during loading
        # Use a thread to avoid blocking the GUI
        t = threading.Thread(target=process_excel, args=(file_path,))
        t.start()

def process_excel(file_path):
    try:
        xls = pd.ExcelFile(file_path)
        sheet_names = xls.sheet_names

        def select_sheet(selected_sheet_index):
            selected_sheet = sheet_names[selected_sheet_index]

            df = pd.read_excel(xls, sheet_name=selected_sheet)
            column_names = df.columns

            def select_column(selected_column_index):
                selected_column = column_names[selected_column_index]
                result_text.delete(1.0, tk.END)  # Clear the existing text
                for item in df[selected_column]:
                    if pd.notna(item):
                        result_text.insert(tk.END, str(item) + "\n")
                
                result_label.config(text=f"Contents of column '{selected_column}' displayed below.")
                save_button.config(state=tk.NORMAL)

            create_selection_tree(column_names, select_column)

        create_sheet_selector_tree(sheet_names, select_sheet)
        
        loading_label.config(text="")
        extract_button.config(state=tk.NORMAL)  # Re-enable the button

    except Exception as e:
        loading_label.config(text=f"An error occurred: {str(e)}")
        extract_button.config(state=tk.NORMAL)  # Re-enable the button

def save_output():
    current_datetime = datetime.datetime.now().strftime("%Y%m%d%H%M%S")  # Get the current date and time as a string
    suggested_filename = f"ext-coldata_{current_datetime}.txt"
    
    output_file = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=[("Text Files", "*.txt")], initialfile=suggested_filename)
    
    if output_file:
        with open(output_file, "w") as file:
            file.write(result_text.get(1.0, tk.END))
        result_label.config(text=f"Contents saved to '{output_file}'.")

def create_sheet_selector_tree(sheet_names, callback):
    sheet_tree = ttk.Treeview(main_frame, columns=("Sheet Name",), selectmode="browse")
    sheet_tree.column("#0", width=0, stretch=tk.NO)  # Hide the first column
    sheet_tree.heading("#0", text="", anchor=tk.W)
    sheet_tree.column("Sheet Name", width=200)
    sheet_tree.heading("Sheet Name", text="Sheet Name")
    
    for i, sheet_name in enumerate(sheet_names):
        sheet_tree.insert("", "end", text=str(i), values=(sheet_name,))
    
    sheet_tree.bind("<<TreeviewSelect>>", lambda event: callback(sheet_tree.index(sheet_tree.selection()[0])))
    
    sheet_tree.pack(side=tk.LEFT, fill=tk.BOTH)

def create_selection_tree(options, callback):
    selection_frame = ttk.Frame(main_frame)
    selection_frame.pack(side=tk.LEFT)
    
    selection_tree = ttk.Treeview(selection_frame, columns=("Column Name",), selectmode="browse")
    selection_tree.column("#0", width=0, stretch=tk.NO)
    selection_tree.heading("#0", text="", anchor=tk.W)
    selection_tree.column("Column Name", width=200)
    selection_tree.heading("Column Name", text="Column Name")
    
    for i, option in enumerate(options):
        selection_tree.insert("", "end", text=str(i), values=(option,))
    
    selection_tree.bind("<<TreeviewSelect>>", lambda event: callback(selection_tree.index(selection_tree.selection()[0])))
    
    selection_tree.pack(side=tk.LEFT, fill=tk.BOTH)

root = tk.Tk()
root.title("Excel Column Extractor")

# Configure the theme to resemble a native Windows app
style = ttk.Style()
style.theme_use('clam')

main_frame = tk.Frame(root)
main_frame.pack(padx=20, pady=20)

intro_label = tk.Label(main_frame, text="Open an .xlsx file to start.")
intro_label.pack()

extract_button = ttk.Button(main_frame, text="Open .xlsx file", command=extract_and_save_column)
extract_button.pack()

loading_label = tk.Label(main_frame, text="")
loading_label.pack()

result_label = tk.Label(main_frame, text="")
result_label.pack()

result_text = ScrolledText(root, wrap=tk.WORD, height=25)
result_text.pack(fill="both", expand=True, padx=10, pady=10)

save_button = ttk.Button(main_frame, text="Save Output", command=save_output, state=tk.DISABLED)
save_button.pack()

root.geometry("800x600")

sv_ttk.set_theme("light")
root.mainloop()