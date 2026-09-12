#!/usr/bin/env python3
"""
Generate a complete, comprehensive, beautifully styled PDF project report
for BIS Sahayak in simple words so anyone can understand it.
Uses ReportLab 5.0.1.
"""

import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and draw total page count
    along with running header and footer.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        
        # Header (pages 2 and later)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0F172A"))
            self.drawString(40, 805, "BIS SAHAYAK (BUREAU OF INDIAN STANDARDS ASSISTANT)")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#D97706"))
            self.drawRightString(555, 805, "Smart India Hackathon 2026 • SIH26107")
            
            # Header rule
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(40, 797, 555, 797)
        
        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(40, 42, 555, 42)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(40, 30, "Live Web App: sih2026-bis-assistant.vercel.app  •  GitHub: github.com/PhoenixOP231/BIS_Sahayak_SIH")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(555, 30, page_str)
        
        self.restoreState()

def create_report(output_pdf_path):
    # Page setup: A4 = 595.27 x 841.89 pt
    # Printable width with 40pt left and right margins = 515.27 pt
    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    C_NAVY_DARK = colors.HexColor("#0F172A")
    C_NAVY_LIGHT = colors.HexColor("#1E3A8A")
    C_SAFFRON = colors.HexColor("#D97706")
    C_SAFFRON_DARK = colors.HexColor("#B45309")
    C_GREEN = colors.HexColor("#059669")
    C_TEXT = colors.HexColor("#334155")
    C_MUTED = colors.HexColor("#64748B")
    C_BG_LIGHT = colors.HexColor("#F8FAFC")
    C_BORDER = colors.HexColor("#E2E8F0")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=C_NAVY_DARK,
        alignment=TA_LEFT,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=C_SAFFRON_DARK,
        alignment=TA_LEFT,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=C_NAVY_DARK,
        spaceBefore=14,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=C_SAFFRON_DARK,
        spaceBefore=9,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.8,
        textColor=C_TEXT,
        alignment=TA_JUSTIFY,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.8,
        textColor=C_TEXT,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.2,
        textColor=colors.HexColor("#1E293B")
    )

    callout_title = ParagraphStyle(
        'Callout_Title',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.2,
        leading=12.5,
        textColor=C_NAVY_DARK,
        spaceAfter=3
    )

    tbl_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=11,
        textColor=colors.white,
        alignment=TA_CENTER
    )

    tbl_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.8,
        textColor=C_TEXT
    )

    tbl_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.8,
        textColor=C_NAVY_DARK
    )

    story = []

    # Helper function for boxed callouts
    def make_callout(title, text, bg_hex="#F8FAFC", border_hex="#CBD5E1", title_color=C_NAVY_DARK):
        p_title = Paragraph(f"<b>{title}</b>", ParagraphStyle('CT', parent=callout_title, textColor=title_color))
        p_body = Paragraph(text, callout_style)
        t = Table([[p_title], [p_body]], colWidths=[515])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor(bg_hex)),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor(border_hex)),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 9),
            ('RIGHTPADDING', (0,0), (-1,-1), 9),
        ]))
        return t

    # Helper for Section Title Banner
    def make_section_header(num, title):
        content = [
            Paragraph(f"<b>{num}. {title.upper()}</b>", h1_style),
            HRFlowable(width="100%", thickness=1.5, color=C_SAFFRON, spaceBefore=2, spaceAfter=6)
        ]
        return content

    # ==========================================
    # COVER / HEADER SECTION
    # ==========================================
    meta_table_data = [
        [
            Paragraph("<b>National Hackathon:</b> Smart India Hackathon (SIH) 2026", callout_style),
            Paragraph("<b>Problem Statement ID:</b> SIH26107 (Software)", callout_style)
        ],
        [
            Paragraph("<b>Project Name:</b> BIS Sahayak (Bureau of Indian Standards Assistant)", callout_style),
            Paragraph("<b>Category:</b> GovTech / Artificial Intelligence / Public Safety", callout_style)
        ],
        [
            Paragraph("<b>Institution:</b> Arvind Gavali College of Engineering, Satara", callout_style),
            Paragraph("<b>Live Portal:</b> sih2026-bis-assistant.vercel.app", callout_style)
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[265, 250])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF3C7")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#F59E0B")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#FDE68A")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))

    story.append(Paragraph("BIS Sahayak (Bureau of Indian Standards Assistant)", title_style))
    story.append(Paragraph("AI-Powered Quality & Safety Companion for Indian Citizens and Small Businesses", subtitle_style))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # ==========================================
    # SECTION 1: EXECUTIVE SUMMARY IN 2 MINUTES
    # ==========================================
    story.extend(make_section_header("1", "Executive Summary: The Entire Project in 2 Minutes"))
    
    p1 = (
        "<b>What is the Bureau of Indian Standards (BIS)?</b><br/>"
        "In India, whenever you purchase an everyday product—such as a kitchen pressure cooker, electrical wiring, "
        "a bottle of packaged drinking water, or a motorcycle helmet—you will notice a small seal called the <b>ISI mark</b>. "
        "The Bureau of Indian Standards (BIS) is the Government of India's apex national standards body. Its constitutional mission "
        "is to formulate and enforce strict quality, safety, and reliability rules across manufactured goods to protect citizens and elevate national industry."
    )
    story.append(Paragraph(p1, body_style))

    p2 = (
        "<b>What is BIS Sahayak?</b><br/>"
        "<b>BIS Sahayak (Bureau of Indian Standards Assistant)</b> is a free, 24/7 web-based AI assistant and product authenticity verification platform. "
        "Think of it as having an expert senior government safety inspector and a seasoned quality compliance consultant available instantly in your pocket. "
        "It digests thousands of pages of dense government gazette notifications and engineering standards, and delivers crisp, instant answers in plain, "
        "accessible English and Hindi. Furthermore, it incorporates an interactive <b>ISI Mark Authenticity Verifier</b> that empowers any citizen to verify "
        "whether the license number printed on a product is genuine or a hazardous counterfeit."
    )
    story.append(Paragraph(p2, body_style))

    c1_text = (
        "<b>Core Innovations at a Glance:</b><br/>"
        "&bull; <b>Dual-Persona Intelligence:</b> Seamlessly toggles between a simple, friendly mode for everyday consumers and an exact engineering mode for factory owners.<br/>"
        "&bull; <b>Zero-Hallucination Architecture:</b> Unlike generic chatbots (like ChatGPT) that guess or invent numbers, BIS Sahayak answers strictly from pre-loaded authentic BIS standard documents.<br/>"
        "&bull; <b>Live CM/L License Verifier:</b> Validates 7 or 8-digit license numbers against certified manufacturer registries and guides users to the official BIS Care Mobile App.<br/>"
        "&bull; <b>Voice & Bilingual Accessibility:</b> Fully bilingual in English and Devanagari Hindi, equipped with one-tap speech synthesis (🔊) for audio assistance."
    )
    story.append(make_callout("KEY HIGHLIGHTS", c1_text, bg_hex="#EFF6FF", border_hex="#3B82F6", title_color=C_NAVY_LIGHT))
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 2: THE REAL-LIFE PROBLEM
    # ==========================================
    story.extend(make_section_header("2", "The Real-Life Problem: Why Was BIS Sahayak Built?"))

    story.append(Paragraph(
        "Every single day in India, millions of consumers and factory owners make quality-related decisions. However, the critical information needed to guarantee safety has been historically trapped behind insurmountable barriers.",
        body_style
    ))

    p_consumer = (
        "<b>1. The Everyday Consumer's Dilemma (Safety Hazards & Counterfeits):</b><br/>"
        "Consider a mother shopping in a local market for a pressure cooker or plastic toys for her children. She notices an ISI stamp on the box. "
        "How can she verify if that mark is genuine or a counterfeit stamp? Sub-standard pressure cookers explode under domestic kitchen heat; "
        "cheap uncertified electrical cables spark house fires; fake children's toys frequently contain toxic lead and heavy metals; and spurious bottled water "
        "spreads microbial pathogens. Most citizens do not know that genuine ISI marks must carry a 7 or 8-digit CM/L license number beneath the emblem, "
        "nor do they know what specific physical safety mechanisms to inspect before buying."
    )
    story.append(Paragraph(p_consumer, body_style))

    p_msme = (
        "<b>2. The Small Business & Factory Owner's Dilemma (Regulatory Friction):</b><br/>"
        "India is home to over 63 million Micro, Small, and Medium Enterprises (MSMEs). When ministries issue mandatory <b>Quality Control Orders (QCOs)</b> "
        "— ordering that steel rebar, PVC conduits, or cement must strictly comply with certified BIS standards — factory owners face immense friction. "
        "They must navigate 100-page dense gazette PDFs filled with engineering formulas, legal clauses, and complex test tables. Hiring private consultants "
        "costs thousands of rupees and weeks of delay, severely hindering the momentum of <i>Make in India</i>."
    )
    story.append(Paragraph(p_msme, body_style))

    p_govt = (
        "<b>3. The Institutional Gap:</b><br/>"
        "While the Bureau of Indian Standards has developed top-tier standards and released the <i>BIS Care Mobile App</i>, ordinary citizens and MSMEs "
        "lack an intuitive conversational interface to bridge technical standard numbers (such as IS 2347 or IS 1786) into practical, everyday answers."
    )
    story.append(Paragraph(p_govt, body_style))

    problem_box = (
        "<b>The Core Challenge:</b><br/>"
        "Indian Standards protect human lives and drive industrial excellence, but they have been locked in complex legal PDFs that ordinary citizens cannot read and small businesses struggle to search."
    )
    story.append(make_callout("THE CORE PROBLEM STATEMENT", problem_box, bg_hex="#FEF2F2", border_hex="#EF4444", title_color=colors.HexColor("#B91C1C")))
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 3: THE SOLUTION & KEY SUPERPOWERS
    # ==========================================
    story.extend(make_section_header("3", "The Solution: What Does BIS Sahayak Do?"))

    story.append(Paragraph(
        "<b>BIS Sahayak</b> bridges this divide by delivering an accessible, 24/7 web-based companion engineered with five key superpowers:",
        body_style
    ))

    features = [
        ("Dual-Persona Intelligence (Consumer vs. Industry)", 
         "Users switch between two dedicated personas with one tap. <b>Consumer Mode</b> provides friendly everyday language, explains what physical features to check, and warns against fake stamps. <b>Industry / MSME Mode</b> delivers exact engineering limits (such as 500 MPa yield stress, spark test voltages, routine vs. type testing regimes, and HS trade classification codes)."),
        
        ("Live 4-Step ISI License Authenticity Verifier (/verify)", 
         "Allows any user to input a 7 or 8-digit CM/L license number. It validates the format, searches verified manufacturer records (including Prestige, Havells, Tata Steel, Finolex), displays registered factory locations, and flags unverified numbers with red counterfeit alerts and direct steps to file complaints on the BIS Care App."),
         
        ("Standards Directory & Slide-Out Clause Drawer (/standards)", 
         "An interactive catalog containing 21 authentic Indian Standards across Civil, Electrical, Kitchen, Consumer Safety, and Energy sectors. Users can click any citation badge inside the chat to open a side drawer with official clauses without losing their conversation."),
         
        ("100% Bilingual Support & Web Speech Audio Assistant", 
         "Every screen, button, and AI answer is natively supported in English and Hindi (Devanagari script). With built-in Web Speech synthesis, non-literate or visually impaired users can tap the speaker icon (🔊) to listen to answers read aloud."),
         
        ("Zero-Hallucination Retrieval-Augmented Generation (RAG)", 
         "Because safety limits cannot tolerate AI errors, the system indexes authentic government standards into mathematical vector embeddings. Google Gemini 2.5 Flash is strictly restricted to generate answers using only retrieved standard clauses.")
    ]

    for f_title, f_desc in features:
        story.append(Paragraph(f"&bull; <b>{f_title}:</b> {f_desc}", bullet_style))

    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 4: REAL-LIFE SCENARIOS (USER STORIES)
    # ==========================================
    story.extend(make_section_header("4", "Real-Life Stories: How People Use BIS Sahayak"))

    s1_text = (
        "<b>Scenario:</b> Ramesh is shopping at a utensil store in Pune to buy a domestic pressure cooker for his family.<br/>"
        "<b>Action:</b> He visits <i>sih2026-bis-assistant.vercel.app</i> on his phone, taps <b>Consumer Mode</b>, and selects <b>हिन्दी</b>.<br/>"
        "<b>Question:</b> <i>'मेरा प्रेशर कुकर सुरक्षित है या नहीं, यह कैसे पहचानें?' (How do I know if my pressure cooker is safe?)</i><br/>"
        "<b>BIS Sahayak's Response:</b><br/>"
        "1. Clarifies that domestic pressure cookers must be certified under <b>IS 2347:2017</b>.<br/>"
        "2. Gives him a 3-point physical safety check: (a) Weight Valve, (b) Metallic Safety Plug, and (c) Gasket Release System.<br/>"
        "3. Emphasizes: <i>'Always confirm the ISI mark has a 7 or 8-digit CM/L license number beneath it.'</i><br/>"
        "4. Ramesh clicks the speaker button (🔊) to hear the answer read aloud in clear Hindi.<br/>"
        "5. He navigates to <b>Verify</b>, inputs the number on the box, and confirms the manufacturer's active certification."
    )
    story.append(make_callout("STORY A: EVERYDAY CITIZEN (CONSUMER MODE)", s1_text, bg_hex="#F0FDF4", border_hex="#22C55E", title_color=C_GREEN))
    story.append(Spacer(1, 6))

    s2_text = (
        "<b>Scenario:</b> Priya operates a steel rolling mill in Jalna and seeks to supply Fe 500D TMT rebars for public infrastructure tenders.<br/>"
        "<b>Action:</b> She switches to <b>Industry / MSME Mode</b> on the portal.<br/>"
        "<b>Question:</b> <i>'What are the mandatory tensile and elongation limits for Fe 500D under IS 1786?'</i><br/>"
        "<b>BIS Sahayak's Response:</b><br/>"
        "&bull; <b>Proof Stress (0.2% Yield):</b> Minimum 500.0 N/mm² (MPa)<br/>"
        "&bull; <b>Tensile Strength (UTS):</b> Minimum 565.0 N/mm²<br/>"
        "&bull; <b>Elongation Percentage:</b> Minimum 16.0% (mandatory for seismic ductility)<br/>"
        "&bull; <b>Clause Drawer:</b> Priya clicks the badge <b>[IS 1786:2008]</b> directly in the chat, opening an instant drawer displaying Clause 8.1 (Chemical Analysis) and Clause 9.2 (Tensile Protocols) without leaving the screen."
    )
    story.append(make_callout("STORY B: SMALL FACTORY OWNER (INDUSTRY MODE)", s2_text, bg_hex="#EFF6FF", border_hex="#3B82F6", title_color=C_NAVY_LIGHT))
    story.append(Spacer(1, 6))

    s3_text = (
        "<b>Scenario:</b> Sunita is buying plastic toys for her 2-year-old child and wants to know if cheap uncertified toys pose risks.<br/>"
        "<b>BIS Sahayak's Response:</b> Explains that under <b>IS 9873</b> and the Government Toy Quality Control Order, uncertified toys often contain dangerous heavy metals (lead, cadmium, phthalates) and pose choking hazards. It gives her visual guidelines to identify compliant toy packaging."
    )
    story.append(make_callout("STORY C: PROTECTING CHILDREN FROM TOXIC TOYS", s3_text, bg_hex="#FFFBEB", border_hex="#F59E0B", title_color=C_SAFFRON_DARK))
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 5: HOW IT WORKS (UNDER THE HOOD)
    # ==========================================
    story.extend(make_section_header("5", "How It Works Under the Hood (Explained Simply)"))

    story.append(Paragraph(
        "Here is the five-step technical process explained in simple, easy-to-understand concepts:",
        body_style
    ))

    pipeline_data = [
        [
            Paragraph("<b>Step 1: Reading & Chunking</b>", tbl_cell_bold),
            Paragraph("Official BIS standards were segmented into clean, structured knowledge blocks: Standard code, Scope, Clauses, Physical & Chemical Limits, and Gazette Mandates.", tbl_cell)
        ],
        [
            Paragraph("<b>Step 2: Vector Embeddings</b>", tbl_cell_bold),
            Paragraph("Each clause is converted into 768-dimensional mathematical coordinates. Concepts with similar meanings are stored close together in mathematical space.", tbl_cell)
        ],
        [
            Paragraph("<b>Step 3: Fast Hybrid Search (&lt;15ms)</b>", tbl_cell_bold),
            Paragraph("When a question arrives, the engine performs hybrid search combining cosine vector math with domain-aware stop-word filtering to identify exact matching clauses in under 15 milliseconds.", tbl_cell)
        ],
        [
            Paragraph("<b>Step 4: AI Formulation (Gemini 2.5)</b>", tbl_cell_bold),
            Paragraph("<b>Google Gemini 2.5 Flash</b> is invoked with strict low temperature (0.3). It is constrained to use ONLY the retrieved clauses, guaranteeing zero hallucinations.", tbl_cell)
        ],
        [
            Paragraph("<b>Step 5: Interactive Presentation</b>", tbl_cell_bold),
            Paragraph("The user receives a clean 2-sentence summary, expandable engineering data tables, clickable citation chips, and live speech audio playback.", tbl_cell)
        ]
    ]

    pipeline_table = Table(pipeline_data, colWidths=[155, 360])
    pipeline_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(pipeline_table)
    story.append(Spacer(1, 8))

    arch_note = (
        "<b>Resilient Serverless Architecture:</b><br/>"
        "&bull; <b>Frontend:</b> Next.js 15 (React 19) and Tailwind CSS deployed globally on Vercel Edge Cloud.<br/>"
        "&bull; <b>Database:</b> Neon Serverless PostgreSQL with <code>pgvector</code>, scaling to zero idle cost.<br/>"
        "&bull; <b>Offline Resilience:</b> An in-memory vector index ensures continuous 100% uptime even if external databases encounter network disconnects."
    )
    story.append(make_callout("ARCHITECTURE & RELIABILITY", arch_note, bg_hex="#F1F5F9", border_hex="#94A3B8", title_color=C_NAVY_DARK))
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 6: THE 21 STANDARDS CATALOG
    # ==========================================
    story.extend(make_section_header("6", "The Standards Catalog: 21 Pre-Loaded Indian Standards"))

    story.append(Paragraph(
        "The current deployment includes 21 authentic Indian Standards representing critical manufacturing and consumer sectors:",
        body_style
    ))

    standards_data = [
        [
            Paragraph("<b>Category</b>", tbl_header),
            Paragraph("<b>Standard</b>", tbl_header),
            Paragraph("<b>Product Covered</b>", tbl_header),
            Paragraph("<b>Key Safety & Quality Limits</b>", tbl_header)
        ],
        [Paragraph("Civil", tbl_cell_bold), Paragraph("IS 1786:2008", tbl_cell), Paragraph("Fe 500D TMT Rebars", tbl_cell), Paragraph("Min 500 MPa yield, min 16% elongation", tbl_cell)],
        [Paragraph("Civil", tbl_cell_bold), Paragraph("IS 269:2015", tbl_cell), Paragraph("Portland Cement", tbl_cell), Paragraph("Compressive strength & sound setting time", tbl_cell)],
        [Paragraph("Civil", tbl_cell_bold), Paragraph("IS 4985:2021", tbl_cell), Paragraph("uPVC Water Pipes", tbl_cell), Paragraph("Hydrostatic pressure & impact resistance", tbl_cell)],
        [Paragraph("Electrical", tbl_cell_bold), Paragraph("IS 694:2010", tbl_cell), Paragraph("PVC Insulated Cables", tbl_cell), Paragraph("6 kV spark test, flame retardancy (FRLS)", tbl_cell)],
        [Paragraph("Electrical", tbl_cell_bold), Paragraph("IS 1293:2019", tbl_cell), Paragraph("Plugs & Sockets (6A/16A)", tbl_cell), Paragraph("Child safety shutters, temperature rise <45K", tbl_cell)],
        [Paragraph("Electrical", tbl_cell_bold), Paragraph("IS 15885:2012", tbl_cell), Paragraph("LED Lighting Drivers", tbl_cell), Paragraph("Thermal overload & short-circuit protection", tbl_cell)],
        [Paragraph("Kitchen", tbl_cell_bold), Paragraph("IS 2347:2017", tbl_cell), Paragraph("Pressure Cookers", tbl_cell), Paragraph("Safety plug, weight valve, gasket release", tbl_cell)],
        [Paragraph("Kitchen", tbl_cell_bold), Paragraph("IS 302-1:2024", tbl_cell), Paragraph("Household Appliances", tbl_cell), Paragraph("Earthing continuity, leakage current limits", tbl_cell)],
        [Paragraph("Kitchen", tbl_cell_bold), Paragraph("IS 2082:2018", tbl_cell), Paragraph("Electric Water Heaters", tbl_cell), Paragraph("Pressure relief, non-scalding thermostat", tbl_cell)],
        [Paragraph("Kitchen", tbl_cell_bold), Paragraph("IS 4250:2022", tbl_cell), Paragraph("Mixer Grinders", tbl_cell), Paragraph("Thermal overload cutout, double insulation", tbl_cell)],
        [Paragraph("Consumer", tbl_cell_bold), Paragraph("IS 14543:2024", tbl_cell), Paragraph("Packaged Drinking Water", tbl_cell), Paragraph("Zero coliform, pesticide limits <0.0001 mg/L", tbl_cell)],
        [Paragraph("Consumer", tbl_cell_bold), Paragraph("IS 10500:2012", tbl_cell), Paragraph("Drinking Water Quality", tbl_cell), Paragraph("Permissible limits for pH, TDS, heavy metals", tbl_cell)],
        [Paragraph("Consumer", tbl_cell_bold), Paragraph("IS 9873:2019", tbl_cell), Paragraph("Safety of Toys", tbl_cell), Paragraph("No swallowable small parts; zero toxic lead", tbl_cell)],
        [Paragraph("Consumer", tbl_cell_bold), Paragraph("IS 16018:2012", tbl_cell), Paragraph("Fire Extinguishers", tbl_cell), Paragraph("Discharge duration, hydraulic burst test", tbl_cell)],
        [Paragraph("Industrial", tbl_cell_bold), Paragraph("IS 3196:2022", tbl_cell), Paragraph("LPG Gas Cylinders", tbl_cell), Paragraph("Hydrostatic stretch test, burst >5.1 MPa", tbl_cell)],
        [Paragraph("Industrial", tbl_cell_bold), Paragraph("IS 4151:2020", tbl_cell), Paragraph("Motorcycle Helmets", tbl_cell), Paragraph("Impact absorption, chin strap retention", tbl_cell)],
        [Paragraph("Industrial", tbl_cell_bold), Paragraph("IS 15298:2016", tbl_cell), Paragraph("Safety Footwear", tbl_cell), Paragraph("200-Joule toe cap impact, slip resistance", tbl_cell)],
        [Paragraph("Energy", tbl_cell_bold), Paragraph("IS 16046:2018", tbl_cell), Paragraph("Lithium-Ion Batteries", tbl_cell), Paragraph("Overcharge protection, thermal abuse check", tbl_cell)],
        [Paragraph("Energy", tbl_cell_bold), Paragraph("IS 7318:2020", tbl_cell), Paragraph("Solar PV Inverters", tbl_cell), Paragraph("Anti-islanding protection, THD <5%", tbl_cell)]
    ]

    std_table = Table(standards_data, colWidths=[90, 85, 140, 200])
    std_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY_DARK),
        ('BOX', (0,0), (-1,-1), 1, C_NAVY_DARK),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT]),
    ]))
    story.append(std_table)
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 7: COMPARISON TABLE
    # ==========================================
    story.extend(make_section_header("7", "Why BIS Sahayak Wins: Comparison with Other Methods"))

    comparison_data = [
        [
            Paragraph("<b>Criterion</b>", tbl_header),
            Paragraph("<b>Government Gazette PDFs</b>", tbl_header),
            Paragraph("<b>General AI (ChatGPT)</b>", tbl_header),
            Paragraph("<b>BIS Sahayak (Our Innovation)</b>", tbl_header)
        ],
        [
            Paragraph("<b>Accessibility</b>", tbl_cell_bold),
            Paragraph("Unsearchable, heavy legal PDFs.", tbl_cell),
            Paragraph("Conversational, lacks Indian context.", tbl_cell),
            Paragraph("<b>Dual Personas:</b> Simple layman or deep engineering.", tbl_cell_bold)
        ],
        [
            Paragraph("<b>Accuracy & Risk</b>", tbl_cell_bold),
            Paragraph("Accurate but hard to extract.", tbl_cell),
            Paragraph("<font color='red'><b>Hallucinates:</b> Invents false MPa or volts.</font>", tbl_cell),
            Paragraph("<b>Zero-Hallucination:</b> Bound to authentic BIS text.", tbl_cell_bold)
        ],
        [
            Paragraph("<b>ISI Verification</b>", tbl_cell_bold),
            Paragraph("Hidden behind complex portals.", tbl_cell),
            Paragraph("Cannot verify 7/8-digit CM/L numbers.", tbl_cell),
            Paragraph("<b>Live 4-Step Verifier:</b> Format check + BIS Care guide.", tbl_cell_bold)
        ],
        [
            Paragraph("<b>Voice & Audio</b>", tbl_cell_bold),
            Paragraph("No speech synthesis.", tbl_cell),
            Paragraph("Requires paid upgrades.", tbl_cell),
            Paragraph("<b>Web Speech:</b> Instant voice in Hindi and English.", tbl_cell_bold)
        ],
        [
            Paragraph("<b>Cost & Barrier</b>", tbl_cell_bold),
            Paragraph("Needs expensive lawyers/consultants.", tbl_cell),
            Paragraph("Subscription fees ($20/month).", tbl_cell),
            Paragraph("<b>100% Free & Open:</b> Works in any mobile browser.", tbl_cell_bold)
        ]
    ]

    comp_table = Table(comparison_data, colWidths=[85, 140, 145, 145])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_SAFFRON_DARK),
        ('BOX', (0,0), (-1,-1), 1, C_SAFFRON_DARK),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT]),
    ]))
    story.append(comp_table)
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 8: NATIONAL IMPACT
    # ==========================================
    story.extend(make_section_header("8", "National Impact: Benefits for India"))

    impact_points = [
        ("1. Protecting 1.4 Billion Citizens (Social Impact & Life Safety)",
         "Empowers everyday families to detect dangerous counterfeit products. An exploding pressure cooker, a faulty geyser, or spurious building wires can destroy lives. BIS Sahayak puts safety knowledge directly in citizens' hands, democratizing consumer protection."),
        
        ("2. Empowering 63 Million Small Businesses (Make in India & Ease of Doing Business)",
         "Drastically reduces regulatory lookup times from days to seconds. Small manufacturers can verify exact testing tolerances, routine test frequencies, and mandatory QCO gazette dates without paying expensive consulting retainers."),
         
        ("3. Supporting the Bureau of Indian Standards (Institutional Adoption)",
         "Builds public awareness and trust in the <b>ISI mark</b>, while directly boosting downloads and grievance filings on the official <b>BIS Care Mobile App</b>."),
         
        ("4. Ethical & Sustainable Computing",
         "The serverless cloud infrastructure consumes energy strictly on demand, minimizing cloud carbon footprints. No user personal data is captured, stored, or monetized.")
    ]

    for i_title, i_desc in impact_points:
        story.append(Paragraph(f"&bull; <b>{i_title}:</b> {i_desc}", bullet_style))

    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 9: QUALITY ASSURANCE & ROADMAP
    # ==========================================
    story.extend(make_section_header("9", "Testing, Quality Assurance & Scalability Roadmap"))

    qa_text = (
        "<b>Automated Test Suite:</b> The system includes 15 automated test suites executed via <b>Vitest</b>. "
        "These verify sub-20ms vector retrieval, CM/L license pattern detection (catching invalid test numbers like <code>11111111</code>), "
        "and complete parity in English/Hindi translation keys."
    )
    story.append(Paragraph(qa_text, body_style))

    story.append(Paragraph("<b>Future Roadmap:</b>", h2_style))
    roadmap_items = [
        ("Phase 1 (Completed Live Prototype)", "21 core standards indexed, dual personas, 4-step ISI verifier, Web Speech voice assistant, and live cloud deployment on Vercel."),
        ("Phase 2 (Next 6 Months)", "Scaling from 21 to all 20,000+ Indian Standards; direct live API sync with the official e-BIS / Manakonline portal for real-time license verification."),
        ("Phase 3 (Next 12 Months)", "WhatsApp Chatbot integration for rural low-bandwidth areas; Mobile Camera OCR to scan product boxes and verify ISI marks automatically; support for 10 regional Indian languages.")
    ]
    for r_title, r_desc in roadmap_items:
        story.append(Paragraph(f"&bull; <b>{r_title}:</b> {r_desc}", bullet_style))

    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 10: QUICK REFERENCE & TEAM DETAILS
    # ==========================================
    story.extend(make_section_header("10", "Quick Reference, Access Links & Team Information"))

    links_table_data = [
        [Paragraph("<b>Resource</b>", tbl_header), Paragraph("<b>Location / URL</b>", tbl_header), Paragraph("<b>Description</b>", tbl_header)],
        [Paragraph("Live Web Application", tbl_cell_bold), Paragraph("https://sih2026-bis-assistant.vercel.app", tbl_cell), Paragraph("Accessible 24/7 on any mobile or desktop browser", tbl_cell)],
        [Paragraph("GitHub Source Code", tbl_cell_bold), Paragraph("https://github.com/PhoenixOP231/BIS_Sahayak_SIH", tbl_cell), Paragraph("Complete open-source repository with automated tests", tbl_cell)],
        [Paragraph("SIH Problem Statement", tbl_cell_bold), Paragraph("SIH26107 (Smart India Hackathon 2026)", tbl_cell), Paragraph("AI-Powered Assistant for Indian Standards & BIS Services", tbl_cell)],
        [Paragraph("Academic Institution", tbl_cell_bold), Paragraph("Arvind Gavali College of Engineering, Satara", tbl_cell), Paragraph("Department of Computer Science & Engineering", tbl_cell)],
        [Paragraph("Project Lead", tbl_cell_bold), Paragraph("Parth Shinde & Team", tbl_cell), Paragraph("AI Architecture & Full-Stack Cloud Engineering", tbl_cell)]
    ]

    links_table = Table(links_table_data, colWidths=[130, 215, 170])
    links_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY_DARK),
        ('BOX', (0,0), (-1,-1), 1, C_NAVY_DARK),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT]),
    ]))
    story.append(links_table)
    story.append(Spacer(1, 10))

    concl_box = (
        "<b>Final Summary:</b><br/>"
        "BIS Sahayak transforms dense government engineering standards into clear, spoken, bilingual guidance and instant license verification. "
        "By dismantling technical and language barriers, it empowers 1.4 billion citizens and millions of small businesses with product safety as an accessible national right."
    )
    story.append(make_callout("MISSION STATEMENT", concl_box, bg_hex="#ECFDF5", border_hex="#10B981", title_color=C_GREEN))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Report generated successfully at: {output_pdf_path}")

if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "Simple_BIS_Sahayak_Report.pdf"
    create_report(out_file)
