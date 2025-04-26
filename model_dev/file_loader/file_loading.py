from langchain_community.document_loaders import PyPDFLoader

def file_loading(file_path):
    """
    Load the data from the given file path.

    Args:
        file_path (str): The path to the file to be loaded.

    Returns:
        str: The content of the file.
    """
    load_pdf = PyPDFLoader(file_path)
    loaded_pdf = load_pdf.load()
    text = ""

    for page in loaded_pdf:
        text += page.page_content
    return text

    

if __name__ == "__main__":
    # Example usage
    # file_path = '/home/omnai/Q_AND_A_Project/Model Development/file_loader/PDF_Store/test.pdf'
    # file_content = file_loading(file_path)
    # print(file_content)
    a = file_loading('/home/omnai/Q_AND_A_Project/Model Development/file_loader/PDF_Store/test.pdf')
    print(a)