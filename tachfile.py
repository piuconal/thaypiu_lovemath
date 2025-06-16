from PyPDF2 import PdfReader, PdfWriter

def split_pdf(input_file, split_page, output_file1, output_file2):
    reader = PdfReader(input_file)
    total_pages = len(reader.pages)

    writer1 = PdfWriter()
    writer2 = PdfWriter()

    # Ghi từ trang đầu đến split_page - 1 vào file 1
    for i in range(split_page):
        writer1.add_page(reader.pages[i])

    # Ghi từ split_page đến hết vào file 2
    for i in range(split_page, total_pages):
        writer2.add_page(reader.pages[i])

    # Lưu file kết quả
    with open(output_file1, "wb") as f1:
        writer1.write(f1)

    with open(output_file2, "wb") as f2:
        writer2.write(f2)

    print(f"Đã tách PDF thành 2 phần: {output_file1} và {output_file2}")

# Ví dụ sử dụng
input_pdf = "test.pdf"
split_at_page = 21  # Trang bắt đầu phần thứ 2 (đánh số từ 0)
output_pdf1 = "tuluan.pdf"
output_pdf2 = "tracnghiem.pdf"

split_pdf(input_pdf, split_at_page, output_pdf1, output_pdf2)
