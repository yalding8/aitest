#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将 Markdown 文件转换为 PDF
使用 markdown 和 reportlab 库
"""

import sys
import subprocess

# 首先尝试安装必要的库
try:
    import markdown
except ImportError:
    print("Installing markdown...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "markdown", "-q"])
    import markdown

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.lib.enums import TA_LEFT, TA_CENTER
except ImportError:
    print("Installing reportlab...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "reportlab", "-q"])
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.lib.enums import TA_LEFT, TA_CENTER

from html.parser import HTMLParser
import re

class HTMLToParagraph(HTMLParser):
    """简单的 HTML 到 Paragraph 转换器"""
    def __init__(self, styles):
        super().__init__()
        self.styles = styles
        self.elements = []
        self.current_text = []
        self.current_style = 'Normal'
        
    def handle_starttag(self, tag, attrs):
        if tag in ['h1', 'h2', 'h3']:
            self.current_style = 'Heading1'
        elif tag == 'strong' or tag == 'b':
            self.current_text.append('<b>')
        elif tag == 'em' or tag == 'i':
            self.current_text.append('<i>')
        elif tag == 'code':
            self.current_text.append('<font name="Courier">')
            
    def handle_endtag(self, tag):
        if tag in ['h1', 'h2', 'h3', 'p', 'li']:
            text = ''.join(self.current_text).strip()
            if text:
                self.elements.append(Paragraph(text, self.styles[self.current_style]))
                self.elements.append(Spacer(1, 0.2*inch))
            self.current_text = []
            self.current_style = 'Normal'
        elif tag == 'strong' or tag == 'b':
            self.current_text.append('</b>')
        elif tag == 'em' or tag == 'i':
            self.current_text.append('</i>')
        elif tag == 'code':
            self.current_text.append('</font>')
            
    def handle_data(self, data):
        self.current_text.append(data)

def markdown_to_pdf(md_file, pdf_file):
    """将 Markdown 文件转换为 PDF"""
    
    # 读取 Markdown 文件
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # 转换为 HTML
    html_content = markdown.markdown(md_content)
    
    # 创建 PDF
    doc = SimpleDocTemplate(pdf_file, pagesize=A4,
                           rightMargin=72, leftMargin=72,
                           topMargin=72, bottomMargin=18)
    
    # 样式
    styles = getSampleStyleSheet()
    
    # 添加中文字体支持（使用系统字体）
    try:
        pdfmetrics.registerFont(TTFont('SimSun', '/System/Library/Fonts/PingFang.ttc'))
        styles['Normal'].fontName = 'SimSun'
        styles['Heading1'].fontName = 'SimSun'
    except:
        pass  # 如果字体加载失败，使用默认字体
    
    # 解析 HTML 并创建段落
    parser = HTMLToParagraph(styles)
    parser.feed(html_content)
    
    # 添加标题
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor='#333333',
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    story = []
    story.append(Paragraph("AI应用及思考能力测试", title_style))
    story.append(Paragraph("考生操作手册", title_style))
    story.append(Spacer(1, 0.5*inch))
    story.extend(parser.elements)
    
    # 生成 PDF
    doc.build(story)
    print(f"✅ PDF 已生成: {pdf_file}")

if __name__ == "__main__":
    markdown_to_pdf("考生操作手册.md", "考生操作手册.pdf")
