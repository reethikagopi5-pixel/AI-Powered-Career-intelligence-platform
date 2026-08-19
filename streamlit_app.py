import streamlit as st
import os
import json
import google.generativeai as genai
from pypdf import PdfReader
import docx2txt

# =========================================================
# CAREERAI - STREAMLIT EDITION
# Your Personal AI Career Intelligence Platform
# =========================================================

st.set_page_config(
    page_title="CareerAI - Personal Career Intelligence Platform",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Styling to match CareerAI Blueprint Theme (#F7F4EB, #16405B, #C8622A)
st.markdown("""
<style>
    .stApp {
        background-color: #F7F4EB;
        color: #0F172A;
        font-family: 'Inter', sans-serif;
    }
    .main-header {
        background-color: #16405B;
        color: white;
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 20px;
    }
    .metric-card {
        background-color: #FFFFFF;
        border: 1px solid #D5CDBD;
        border-radius: 10px;
        padding: 16px;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .stButton>button {
        background-color: #16405B;
        color: white;
        border-radius: 8px;
        font-weight: 600;
        border: none;
    }
    .stButton>button:hover {
        background-color: #103046;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# Helper function to extract text from files
def extract_text_from_file(uploaded_file):
    text = ""
    try:
        if uploaded_file.name.endswith('.pdf'):
            pdf_reader = PdfReader(uploaded_file)
            for page in pdf_reader.pages:
                text += page.extract_text() or ""
        elif uploaded_file.name.endswith('.docx'):
            text = docx2txt.process(uploaded_file)
        elif uploaded_file.name.endswith('.txt'):
            text = uploaded_file.read().decode('utf-8')
    except Exception as e:
        st.error(f"Error reading file: {e}")
    return text

# Initialize Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    api_key = st.sidebar.text_input("🔑 Enter Gemini API Key", type="password", help="Enter your Google Gemini API key to power AI tools.")

if api_key:
    try:
        genai.configure(api_key=api_key)
    except Exception as e:
        st.sidebar.error(f"API Configuration error: {e}")

# Sidebar Navigation
st.sidebar.title("🚀 CareerAI")
st.sidebar.caption("Your Personal AI Career Intelligence Platform")

nav_option = st.sidebar.radio(
    "Select Module:",
    [
        "📊 Dashboard",
        "📄 Resume Parsing & Review",
        "🎯 ATS & Skill Gap Analysis",
        "🛣️ Career Paths & Roadmap",
        "💰 Salary Intelligence",
        "🤖 AI Career Mentor",
        "🎤 Interview Practice"
    ]
)

# ---------------------------------------------------------
# 1. DASHBOARD
# ---------------------------------------------------------
if nav_option == "📊 Dashboard":
    st.markdown("""
    <div class="main-header">
        <h1 style="margin:0; font-size: 28px;">🚀 CareerAI Platform Overview</h1>
        <p style="margin:4px 0 0 0; opacity: 0.9; font-size: 14px;">Your Personal AI Career Intelligence Platform</p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown("""
        <div class="metric-card">
            <h3 style="margin:0; color:#16405B;">84%</h3>
            <p style="margin:0; font-size:12px; color:#64748B;">ATS Match Score</p>
        </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown("""
        <div class="metric-card">
            <h3 style="margin:0; color:#16405B;">12</h3>
            <p style="margin:0; font-size:12px; color:#64748B;">Skills Extracted</p>
        </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown("""
        <div class="metric-card">
            <h3 style="margin:0; color:#C8622A;">₹14.5 LPA</h3>
            <p style="margin:0; font-size:12px; color:#64748B;">Estimated Salary</p>
        </div>
        """, unsafe_allow_html=True)
    with col4:
        st.markdown("""
        <div class="metric-card">
            <h3 style="margin:0; color:#16405B;">82/100</h3>
            <p style="margin:0; font-size:12px; color:#64748B;">Career Readiness</p>
        </div>
        """, unsafe_allow_html=True)

    st.write("---")
    st.subheader("💡 Core Career Objectives")
    st.markdown("""
    - **1. Resume Analysis System**: Extract structured candidate details from PDF/DOCX/TXT files.
    - **2. Skill Gap Identification**: Discover missing high-priority technical skills.
    - **3. Career Recommendations**: Explore personalized role trajectories and salary projections.
    - **4. 30-60-90 Day Roadmaps**: Structured learning resources (Coursera, edX, freeCodeCamp).
    - **5. AI Career Mentor & Interview Practice**: Mock practice & STAR bullet rewriters.
    """)

# ---------------------------------------------------------
# 2. RESUME PARSING & REVIEW
# ---------------------------------------------------------
elif nav_option == "📄 Resume Parsing & Review":
    st.title("📄 AI Resume Extraction & Data Verification")
    st.write("Upload your CV to extract personal details, education, work experience, skills, and projects.")

    uploaded_file = st.file_uploader("Upload Resume File (PDF, DOCX, TXT)", type=["pdf", "docx", "txt"])

    if uploaded_file:
        raw_text = extract_text_from_file(uploaded_file)
        st.success(f"File loaded successfully: {uploaded_file.name} ({len(raw_text)} characters extracted)")

        if st.button("🤖 Parse & Structure Resume with AI"):
            if not api_key:
                st.warning("Please provide a Gemini API Key in the sidebar.")
            else:
                with st.spinner("CareerAI is parsing text into structured JSON..."):
                    try:
                        model = genai.GenerativeModel("gemini-1.5-flash")
                        prompt = f"""You are an ATS resume parser. Extract details from this resume text into clean valid JSON:
                        {{
                            "name": "Full Name",
                            "email": "Email",
                            "phone": "Phone",
                            "targetRole": "Current or target role",
                            "summary": "Professional summary",
                            "skills": ["Skill1", "Skill2"],
                            "education": [{"institution": "Univ Name", "degree": "Degree", "year": "2024"}],
                            "experience": [{"company": "Company", "role": "Role", "duration": "2022-Present"}],
                            "projects": ["Project Name & description"]
                        }}

                        Resume Text:
                        {raw_text[:5000]}
                        """
                        response = model.generate_content(prompt)
                        res_text = response.text.replace("```json", "").replace("```", "").strip()
                        parsed = json.loads(res_text)

                        st.subheader("✅ Extracted Resume Profile")
                        st.json(parsed)

                        # Store in session state
                        st.session_state["resume_data"] = parsed
                    except Exception as e:
                        st.error(f"Parsing error: {e}")

# ---------------------------------------------------------
# 3. ATS & SKILL GAP ANALYSIS
# ---------------------------------------------------------
elif nav_option == "🎯 ATS & Skill Gap Analysis":
    st.title("🎯 ATS Matching & Skill Gap Analysis")

    target_role = st.text_input("Target Job Role", value="Full Stack Software Engineer")
    jd_text = st.text_area("Paste Job Description (Optional)", height=150, placeholder="Paste job requirements here...")

    if st.button("Run ATS Skill Gap Analysis"):
        if not api_key:
            st.warning("Please enter a Gemini API Key in the sidebar.")
        else:
            with st.spinner("Analyzing skill match and ATS compatibility..."):
                try:
                    model = genai.GenerativeModel("gemini-1.5-flash")
                    prompt = f"Perform ATS skill gap analysis for target role '{target_role}' given job description '{jd_text}'. Return JSON with atsScore, matchedSkills, missingSkills, and improvementTips."
                    response = model.generate_content(prompt)
                    res_text = response.text.replace("```json", "").replace("```", "").strip()
                    analysis = json.loads(res_text)

                    st.subheader(f"ATS Score: {analysis.get('atsScore', 82)}/100")
                    col_a, col_b = st.columns(2)
                    with col_a:
                        st.write("### ✅ Matched Skills")
                        for s in analysis.get('matchedSkills', ['JavaScript', 'React', 'Node.js', 'SQL']):
                            st.success(s)
                    with col_b:
                        st.write("### ⚠️ Missing Skills")
                        for ms in analysis.get('missingSkills', ['Docker & Kubernetes', 'System Architecture', 'CI/CD Pipelines']):
                            st.error(ms)
                except Exception as e:
                    st.error(f"Analysis error: {e}")

# ---------------------------------------------------------
# 4. AI CAREER MENTOR
# ---------------------------------------------------------
elif nav_option == "🤖 AI Career Mentor":
    st.title("🤖 CareerAI Assistant & Mentor")
    st.write("Ask CareerAI for career advice, resume tips, or interview preparation guidance.")

    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []

    for msg in st.session_state.chat_history:
        with st.chat_message(msg["role"]):
            st.write(msg["content"])

    user_input = st.chat_input("Type your career query...")
    if user_input:
        st.session_state.chat_history.append({"role": "user", "content": user_input})
        with st.chat_message("user"):
            st.write(user_input)

        if not api_key:
            reply = "Please enter your Gemini API Key in the sidebar to chat with AI Mentor."
        else:
            try:
                model = genai.GenerativeModel("gemini-1.5-flash")
                res = model.generate_content(f"You are CareerAI Mentor. Answer this career question concisely: {user_input}")
                reply = res.text
            except Exception as e:
                reply = f"Error: {e}"

        st.session_state.chat_history.append({"role": "assistant", "content": reply})
        with st.chat_message("assistant"):
            st.write(reply)

# ---------------------------------------------------------
# 5. INTERVIEW PRACTICE
# ---------------------------------------------------------
elif nav_option == "🎤 Interview Practice":
    st.title("🎤 Dynamic Mock Interview Generator")

    company = st.selectbox("Target Company Tier", ["Google / Meta", "Microsoft / Amazon", "Top Tech Startups", "General Tech Role"])
    difficulty = st.select_slider("Difficulty", options=["Easy", "Medium", "Hard"])

    if st.button("Generate Interview Questions"):
        if not api_key:
            st.warning("Please enter your Gemini API Key in the sidebar.")
        else:
            with st.spinner("Generating role-specific interview practice set..."):
                try:
                    model = genai.GenerativeModel("gemini-1.5-flash")
                    prompt = f"Generate 3 realistic interview questions for {company} at {difficulty} level. Include STAR answers and key takeaways."
                    response = model.generate_content(prompt)
                    st.write(response.text)
                except Exception as e:
                    st.error(f"Error generating questions: {e}")
