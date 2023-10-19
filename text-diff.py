import tkinter as tk
from tkinter import filedialog
from tkinter import ttk
from tkinter.scrolledtext import ScrolledText
from datetime import datetime

def compare_and_write_diff(file1_path, file2_path):
    with open(file1_path, 'r') as file1, open(file2_path, 'r') as file2:
        lines1 = file1.readlines()
        lines2 = file2.readlines()

    diff_lines1 = [line for line in lines1 if line not in lines2]
    diff_lines2 = [line for line in lines2 if line not in lines1]

    diff_result = "Difference in File 1:\n" + "".join(diff_lines1) + "\nDifference in File 2:\n" + "".join(diff_lines2)
    return diff_result

def select_file1():
    file1_path = filedialog.askopenfilename(title="Select File 1")
    file1_entry.delete(0, tk.END)
    file1_entry.insert(0, file1_path)

def select_file2():
    file2_path = filedialog.askopenfilename(title="Select File 2")
    file2_entry.delete(0, tk.END)
    file2_entry.insert(0, file2_path)

def compare_files():
    file1_path = file1_entry.get()
    file2_path = file2_entry.get()
    
    diff_result = compare_and_write_diff(file1_path, file2_path)
    text_box.delete(1.0, tk.END)  # Clear the text box
    text_box.insert(tk.END, diff_result)

def save_result():
    diff_result = text_box.get(1.0, tk.END)
    current_datetime = datetime.now().strftime("%Y%m%d%H%M%S")
    output_file_name = f'dif-res_{current_datetime}.txt'

    with open(output_file_name, 'w') as output_file:
        output_file.write(diff_result)

# Create a modern Windows app style
root = tk.Tk()
root.title("Text File Comparator")

style = ttk.Style()
style.configure("TButton", padding=6, relief="flat", background="#007acc", font=('Helvetica', 10))
style.map("TButton", foreground=[("active", "black")])

file1_frame = ttk.LabelFrame(root, text="Select File 1")
file1_frame.pack(pady=10, padx=10, fill="x")

file1_label = ttk.Label(file1_frame, text="Select File 1:")
file1_label.grid(row=0, column=0, sticky="w")

file1_entry = ttk.Entry(file1_frame)
file1_entry.grid(row=0, column=1, padx=5, sticky="w")

file1_button = ttk.Button(file1_frame, text="Browse", command=select_file1)
file1_button.grid(row=0, column=2, padx=5)

file2_frame = ttk.LabelFrame(root, text="Select File 2")
file2_frame.pack(pady=10, padx=10, fill="x")

file2_label = ttk.Label(file2_frame, text="Select File 2:")
file2_label.grid(row=0, column=0, sticky="w")

file2_entry = ttk.Entry(file2_frame)
file2_entry.grid(row=0, column=1, padx=5, sticky="w")

file2_button = ttk.Button(file2_frame, text="Browse", command=select_file2)
file2_button.grid(row=0, column=2, padx=5)

compare_button = ttk.Button(root, text="Compare Files", command=compare_files)
compare_button.pack(pady=10)

# Add a scrollable text box
text_box = ScrolledText(root, wrap=tk.WORD, height=25)
text_box.pack(fill="both", expand=True, padx=10, pady=10)

save_button = ttk.Button(root, text="Save Result", command=save_result)
save_button.pack(pady=10)

root.mainloop()
