import { jsPDF } from 'jspdf';

export function exportDiagnosisPdf(diagnosis, userName = 'Agri Farmer') {
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(22, 163, 74); // Agri green
    doc.text('AGRO ADVISOR AI - CROP HEALTH ADVISORY REPORT', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated for: ${userName} | Date: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text('Powered by Google Gemini 2.5 Multimodal Engine', 14, 34);

    doc.setLineWidth(0.5);
    doc.setDrawColor(203, 213, 225);
    doc.line(14, 38, 196, 38);

    // Section 1: Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('1. Diagnostic Overview', 14, 48);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Crop Name: ${diagnosis.crop_name}`, 14, 56);
    doc.text(`Detected Condition: ${diagnosis.detected_issue}`, 14, 63);
    doc.text(`Model Confidence Score: ${diagnosis.confidence_score}%`, 14, 70);
    doc.text(`Assessed Severity Level: ${diagnosis.severity}`, 14, 77);

    // Section 2: Symptoms
    let y = 90;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Pathological Symptoms', 14, y);

    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (diagnosis.symptoms && diagnosis.symptoms.length > 0) {
        diagnosis.symptoms.forEach(sym => {
            doc.text(`• ${sym}`, 18, y);
            y += 6;
        });
    } else {
        doc.text('Standard visual disease indicators observed on foliage.', 18, y);
        y += 6;
    }

    // Section 3: Treatment Plan
    y += 6;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Actionable Treatment Plan', 14, y);

    y += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 163, 74);
    doc.text('Organic / Biological Control:', 14, y);

    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const organic = diagnosis.treatment_plan?.organic || [];
    organic.forEach(item => {
        doc.text(`- ${item}`, 18, y);
        y += 6;
    });

    y += 4;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235); // Blue
    doc.text('Chemical Control Protocols:', 14, y);

    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const chemical = diagnosis.treatment_plan?.chemical || [];
    chemical.forEach(item => {
        doc.text(`- ${item}`, 18, y);
        y += 6;
    });

    // Save File
    doc.save(`AgroAdvisor-Diagnosis-${diagnosis.crop_name}-${Date.now()}.pdf`);
}
