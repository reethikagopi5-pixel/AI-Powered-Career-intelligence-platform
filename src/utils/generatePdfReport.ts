import { jsPDF } from 'jspdf';
import { AnalysisResult, UserProfile } from '../types';
import { formatRupeeSalary } from './salaryFormatter';

export function generatePdfReport(analysis: AnalysisResult, user?: UserProfile) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [37, 99, 235]; // #2563EB (Blue)
  const secondaryColor = [15, 23, 42]; // #0F172A (Navy)
  const accentColor = [30, 64, 175]; // Darker Blue
  const grayTextColor = [71, 85, 105]; // Slate-600

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  function checkNewPage(neededHeight: number) {
    if (yPos + neededHeight > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      drawHeaderFooter();
    }
  }

  function drawHeaderFooter() {
    // Subtle top border bar
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 4, 'F');

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('CareerAI - AI-Powered Career Intelligence Platform', margin, pageHeight - 8);
    const dateStr = new Date(analysis.createdAt || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    doc.text(`Generated: ${dateStr}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // --- TOP HEADER BLOCK ---
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.rect(margin, yPos, contentWidth, 24, 'F');

  // Accent left bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, yPos, 4, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('CAREER INTELLIGENCE & EVALUATION REPORT', margin + 8, yPos + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('Comprehensive ATS Analysis, Skill Gap Matrix & Career Roadmap', margin + 8, yPos + 17);

  yPos += 30;

  // --- CANDIDATE & TARGET ROLE BANNER ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos, contentWidth, 26, 2, 2, 'FD');

  const candidateName = analysis.extractedData?.name || user?.name || 'Candidate Profile';
  const email = analysis.extractedData?.email || user?.email || 'N/A';
  const targetRole = analysis.targetRole || user?.targetRole || 'Software Professional';

  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Candidate: ${candidateName}`, margin + 6, yPos + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
  doc.text(`Email: ${email}`, margin + 6, yPos + 17);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`Target Role: ${targetRole}`, margin + contentWidth / 2 + 5, yPos + 9);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
  doc.text(`Resume File: ${analysis.resumeName || 'Uploaded_Resume.pdf'}`, margin + contentWidth / 2 + 5, yPos + 17);

  yPos += 32;

  // --- SECTION: OVERVIEW METRICS & ATS SCORE ---
  checkNewPage(45);

  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.text('1. ATS BENCHMARK & EVALUATION SUMMARY', margin + 4, yPos + 5.5);

  yPos += 12;

  // Box 1: Overall ATS Score
  const boxWidth = (contentWidth - 6) / 3;
  doc.setFillColor(239, 246, 255); // Blue tint
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin, yPos, boxWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${analysis.atsScore} / 100`, margin + boxWidth / 2, yPos + 12, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Overall ATS Score', margin + boxWidth / 2, yPos + 19, { align: 'center' });

  // Box 2: Skill Match Alignment
  doc.setFillColor(240, 253, 244); // Green tint
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin + boxWidth + 3, yPos, boxWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(16, 185, 129);
  doc.text(`${analysis.skillGap.matchPercentage}%`, margin + boxWidth + 3 + boxWidth / 2, yPos + 12, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Skill Matrix Alignment', margin + boxWidth + 3 + boxWidth / 2, yPos + 19, { align: 'center' });

  // Box 3: Market Median Salary
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + (boxWidth + 3) * 2, yPos, boxWidth, 24, 2, 2, 'FD');

  const formattedEst = formatRupeeSalary(analysis.salaryPrediction?.currentEstimatedAvg || 1450000);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(formattedEst.lpa, margin + (boxWidth + 3) * 2 + boxWidth / 2, yPos + 12, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Current Market Median (INR)', margin + (boxWidth + 3) * 2 + boxWidth / 2, yPos + 19, { align: 'center' });

  yPos += 30;

  // Score Breakdown Bars
  checkNewPage(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('ATS Score Breakdown Criteria:', margin, yPos);
  yPos += 5;

  const scoreItems = [
    { label: 'Keyword Match', score: analysis.scoreBreakdown?.keywordMatch || 80 },
    { label: 'Formatting Quality', score: analysis.scoreBreakdown?.formatting || 85 },
    { label: 'Impact Metrics', score: analysis.scoreBreakdown?.impactMetrics || 70 },
    { label: 'Section Completeness', score: analysis.scoreBreakdown?.sectionCompleteness || 90 },
  ];

  scoreItems.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text(`${item.label}: ${item.score}%`, margin, yPos + 3);

    // Progress bar bg
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin + 45, yPos, contentWidth - 45, 4, 1, 1, 'F');

    // Progress bar fill
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    const fillWidth = Math.max(2, ((contentWidth - 45) * item.score) / 100);
    doc.roundedRect(margin + 45, yPos, fillWidth, 4, 1, 1, 'F');

    yPos += 7;
  });

  yPos += 5;

  // Summary quote
  if (analysis.summary) {
    checkNewPage(20);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, yPos, contentWidth, 16, 1, 1, 'FD');

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    const splitSummary = doc.splitTextToSize(`"${analysis.summary}"`, contentWidth - 8);
    doc.text(splitSummary, margin + 4, yPos + 6);
    yPos += 22;
  }

  // --- SECTION: SKILL GAP MATRIX ---
  checkNewPage(45);
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.text('2. SKILL GAP MATRIX & COMPETENCY ANALYSIS', margin + 4, yPos + 5.5);

  yPos += 12;

  const halfWidth = (contentWidth - 6) / 2;

  // Strengths Column
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, yPos, halfWidth, 35, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52);
  doc.text('Verified Skills & Strengths', margin + 4, yPos + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  const strengths = analysis.skillGap.identifiedStrengths || [];
  let strengthY = yPos + 13;
  strengths.slice(0, 5).forEach((str) => {
    doc.text(`• ${str}`, margin + 6, strengthY);
    strengthY += 4.5;
  });

  // Missing Skills Column
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin + halfWidth + 6, yPos, halfWidth, 35, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(153, 27, 27);
  doc.text('Identified Missing Skills (Gaps)', margin + halfWidth + 10, yPos + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  const missing = analysis.skillGap.missingSkills || [];
  let missingY = yPos + 13;
  missing.slice(0, 5).forEach((sk) => {
    const name = typeof sk === 'string' ? sk : sk.name;
    const importance = typeof sk === 'object' && sk.importance ? ` [${sk.importance}]` : '';
    doc.text(`• ${name}${importance}`, margin + halfWidth + 12, missingY);
    missingY += 4.5;
  });

  yPos += 42;

  // --- SECTION: CAREER PROGRESSION ROADMAP ---
  checkNewPage(50);
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.text('3. CAREER PATH & PROGRESSION ROADMAP', margin + 4, yPos + 5.5);

  yPos += 12;

  const roadmapSteps = analysis.careerPath?.roadmap || [];
  roadmapSteps.forEach((step, idx) => {
    checkNewPage(22);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, yPos, contentWidth, 18, 1.5, 1.5, 'FD');

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.circle(margin + 8, yPos + 9, 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`${idx + 1}`, margin + 8, yPos + 10.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(`${step.level || 'Step'} - ${step.title}`, margin + 16, yPos + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`Timeline: ${step.timeline}`, margin + contentWidth - 4, yPos + 7, { align: 'right' });

    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text(`Key Skills: ${(step.requiredSkills || []).join(', ')}`, margin + 16, yPos + 13);

    yPos += 22;
  });

  yPos += 5;

  // --- SECTION: SALARY PREDICTION & TRAJECTORY ---
  checkNewPage(40);
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.text('4. SALARY RANGE PREDICTION & MARKET FORECAST', margin + 4, yPos + 5.5);

  yPos += 12;

  const trajectory = analysis.salaryPrediction?.trajectory || [];
  if (trajectory.length > 0) {
    const colWidth = contentWidth / Math.min(trajectory.length, 5);
    trajectory.slice(0, 5).forEach((t, i) => {
      const x = margin + i * colWidth;
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(x, yPos, colWidth - 2, 20, 1, 1, 'FD');

      const avgFmt = formatRupeeSalary(t.avgSalary);
      const minFmt = formatRupeeSalary(t.minSalary);
      const maxFmt = formatRupeeSalary(t.maxSalary);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(t.yearLabel || `Year ${t.year}`, x + (colWidth - 2) / 2, yPos + 6, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(avgFmt.lpa, x + (colWidth - 2) / 2, yPos + 13, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
      doc.text(`${minFmt.lakhsShort} - ${maxFmt.lakhsShort}`, x + (colWidth - 2) / 2, yPos + 17, { align: 'center' });
    });
    yPos += 26;
  }

  // --- SECTION: LEARNING RECOMMENDATIONS & IMPROVEMENT TIPS ---
  checkNewPage(40);
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.text('5. CURATED LEARNING RESOURCES & ACTIONABLE TIPS', margin + 4, yPos + 5.5);

  yPos += 12;

  const resources = analysis.learningResources || [];
  resources.slice(0, 4).forEach((res) => {
    checkNewPage(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(`• ${res.courseTitle}`, margin, yPos);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`Platform: ${res.platform} | Est: ${res.estimatedHours} hrs | Level: ${res.difficulty}`, margin + 5, yPos + 4.5);

    yPos += 9;
  });

  const tips = analysis.improvementTips || [];
  if (tips.length > 0) {
    yPos += 2;
    checkNewPage(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Resume Quality Optimization Tips:', margin, yPos);
    yPos += 5;

    tips.slice(0, 3).forEach((tip) => {
      checkNewPage(10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
      doc.text(`- [${tip.severity}] ${tip.tip}`, margin + 2, yPos);
      yPos += 5;
    });
  }

  // --- SECTION: INTERVIEW TIPS & MODEL QUESTIONS ---
  checkNewPage(45);
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.text('6. RESUME-DRIVEN INTERVIEW TIPS & MODEL QUESTIONS', margin + 4, yPos + 5.5);

  yPos += 12;

  const topSkills = analysis.extractedData?.skills || user?.skills || ['React', 'Node.js', 'TypeScript', 'SQL'];
  const primarySkill = topSkills[0] || 'Core Engineering';
  const targetRoleName = analysis.targetRole || user?.targetRole || 'Software Professional';

  const modelQuestions = [
    {
      type: 'Resume Technical Deep-Dive',
      q: `In your uploaded resume, you listed proficiency in ${primarySkill}. How have you applied ${primarySkill} to optimize component rendering or asynchronous state flow in your real-world projects?`,
      tip: `Focus on technical depth with ${primarySkill}. Quantify performance improvements (e.g. sub-100ms latency).`,
      star: `STAR Method: Situation (complex UI flow) -> Task (maintain 60fps) -> Action (memoization/hooks) -> Result (40% fewer re-renders).`
    },
    {
      type: 'Experience & Project Drill-Down',
      q: `Walk me through the database schema and API integration strategy for the primary full-stack project featured on your resume.`,
      tip: 'Demonstrate architectural trade-offs, security considerations, and scalability choices.',
      star: `STAR Method: Situation (scaling API) -> Task (ensure high availability) -> Action (indexing/caching) -> Result (99.9% uptime).`
    },
    {
      type: 'Skill Gap & System Architecture',
      q: `Your resume shows strong experience in development, but target role (${targetRoleName}) requires system design. How would you architect a caching layer or microservice?`,
      tip: 'Address identified system design gaps with confidence using standard architectural patterns.',
      star: `STAR Method: Situation (traffic spikes) -> Task (decouple services) -> Action (Redis cache & queues) -> Result (65% database load reduction).`
    }
  ];

  modelQuestions.forEach((item, idx) => {
    checkNewPage(30);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, yPos, contentWidth, 26, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`Q${idx + 1} [${item.type}]:`, margin + 4, yPos + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    const splitQ = doc.splitTextToSize(item.q, contentWidth - 10);
    doc.text(splitQ, margin + 4, yPos + 11);

    const qLines = splitQ.length;
    let tipY = yPos + 11 + (qLines * 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    const splitStar = doc.splitTextToSize(`STAR Blueprint: ${item.star}`, contentWidth - 10);
    doc.text(splitStar, margin + 4, tipY);

    yPos += Math.max(28, 14 + (qLines * 4) + (splitStar.length * 3.5));
  });

  // Final Header/Footer pass for all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawHeaderFooter();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  // Save PDF
  const filename = `${candidateName.replace(/\s+/g, '_')}_CareerAI_Report.pdf`;
  doc.save(filename);
}
