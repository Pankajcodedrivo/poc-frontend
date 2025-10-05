import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Card from "./Card";
import SendEmail from "./SendEmail";

interface ResultsProps {
  data: {
    visa: string; // HTML string
    budget: {
      totalUSD: number;
      totalLocal: number;
      perDayUSD: number;
      perDayLocal: number;
      breakdown: {
        accommodationUSD: number;
        accommodationLocal: number;
        foodUSD: number;
        foodLocal: number;
        transportationUSD: number;
        transportationLocal: number;
        activitiesUSD: number;
        activitiesLocal: number;
        stayUSD: number;
        stayLocal: number;
      };
    };
    local: {
      apps: string[];
      eSIM: string[];
    };
    currency: {
      localCurrency: string;
      exchangeTips: string[];
    };
    safety: {
      generalSafety: string;
      emergencyNumbers: {
        police: number;
        ambulanceFire: number;
      };
      travelInsurance: string;
    };
    mini: string[];
  };
}

const Results = ({ data }: ResultsProps) => {
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    const addText = (text: string, x: number, y: number, lineHeight = 8, fontSize = 12) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, pageWidth - x - 20);
      for (let i = 0; i < lines.length; i++) {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(lines[i], x, y);
        y += lineHeight;
      }
      return y;
    };

    // Title
    doc.setFontSize(18);
    doc.text("Travel Planner - Results", 14, 20);
    let y = 30;

    // Visa
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = data.visa;
    const visaText = tempDiv.innerText || tempDiv.textContent || "";
    y = addText("Visa & Entry", 14, y, 10, 14);
    y = addText(visaText, 14, y);

    // Budget Table (USD + Local)
    autoTable(doc, {
      startY: y + 5,
      head: [["Category", "USD", data.currency.localCurrency]],
      body: [
        ["Accommodation", data.budget.breakdown.accommodationUSD, data.budget.breakdown.accommodationLocal],
        ["Food", data.budget.breakdown.foodUSD, data.budget.breakdown.foodLocal],
        ["Transportation", data.budget.breakdown.transportationUSD, data.budget.breakdown.transportationLocal],
        ["Activities", data.budget.breakdown.activitiesUSD, data.budget.breakdown.activitiesLocal],
        ["Stay", data.budget.breakdown.stayUSD, data.budget.breakdown.stayLocal],
        ["Total / Day", data.budget.perDayUSD, data.budget.perDayLocal],
        ["Total Trip", data.budget.totalUSD, data.budget.totalLocal],
      ],
    });
    y = (doc as any).lastAutoTable.finalY + 15;

    // Local Tools
    y = addText("Local Tools & Connectivity", 14, y, 10, 14);
    y = addText("Apps: " + data.local.apps.join(", "), 14, y);
    y = addText("eSIMs: " + data.local.eSIM.join(", "), 14, y);

    // Currency
    y = addText("Currency & Exchange Tips", 14, y + 10, 10, 14);
    y = addText(`Local Currency: ${data.currency.localCurrency}`, 14, y);
    data.currency.exchangeTips.forEach((tip) => {
      y = addText(`- ${tip}`, 14, y);
    });

    // Safety
    y = addText("Safety & Emergency", 14, y + 10, 10, 14);
    y = addText(`General Safety: ${data.safety.generalSafety}`, 14, y);
    y = addText(
      `Emergency Numbers: Police - ${data.safety.emergencyNumbers.police}, Ambulance/Fire - ${data.safety.emergencyNumbers.ambulanceFire}`,
      14,
      y
    );
    y = addText(`Travel Insurance: ${data.safety.travelInsurance}`, 14, y);

    // Mini Plan
    y = addText("Mini Plan", 14, y + 10, 10, 14);
    data.mini.forEach((item, idx) => {
      y = addText(`${idx + 1}. ${item}`, 14, y);
    });

    doc.save("travel-plan.pdf");
  };

  return (
    <div className="results">
      <Card title="">
        <div dangerouslySetInnerHTML={{ __html: data.visa }} />
      </Card>

      <Card title="Budget Breakdown">
        <ul>
          <li>
            Accommodation: ${data.budget.breakdown.accommodationUSD} (~{data.budget.breakdown.accommodationLocal}{" "}
            {data.currency.localCurrency})
          </li>
          <li>
            Food: ${data.budget.breakdown.foodUSD} (~{data.budget.breakdown.foodLocal} {data.currency.localCurrency})
          </li>
          <li>
            Transportation: ${data.budget.breakdown.transportationUSD} (~{data.budget.breakdown.transportationLocal}{" "}
            {data.currency.localCurrency})
          </li>
          <li>
            Activities: ${data.budget.breakdown.activitiesUSD} (~{data.budget.breakdown.activitiesLocal}{" "}
            {data.currency.localCurrency})
          </li>
          <li>
            Stay: ${data.budget.breakdown.stayUSD} (~{data.budget.breakdown.stayLocal} {data.currency.localCurrency})
          </li>
        </ul>
        <p>
          Total / Day: ${data.budget.perDayUSD} (~{data.budget.perDayLocal} {data.currency.localCurrency})
        </p>
        <p>
          Total Trip: ${data.budget.totalUSD} (~{data.budget.totalLocal} {data.currency.localCurrency})
        </p>
      </Card>

      <Card title="Local Tools & Connectivity">
        <p>Apps: {data.local.apps.join(", ")}</p>
        <p>eSIMs: {data.local.eSIM.join(", ")}</p>
      </Card>

      <Card title="Currency & Exchange Tips">
        <p>Local Currency: {data.currency.localCurrency}</p>
        <ul className="list">
          {data.currency.exchangeTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </Card>

      <Card title="Safety & Emergency">
        <p>{data.safety.generalSafety}</p>
        <p>
          Emergency Numbers - Police: {data.safety.emergencyNumbers.police}, Ambulance/Fire:{" "}
          {data.safety.emergencyNumbers.ambulanceFire}
        </p>
        <p>Travel Insurance: {data.safety.travelInsurance}</p>
      </Card>

      <Card title="Mini Plan">
        <ul>
          {data.mini.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </Card>

      <div className="actions">
        <button className="export-btn" onClick={handleExportPDF}>
          Export to PDF
        </button>
        <SendEmail data={data} />
      </div>
    </div>
  );
};

export default Results;