import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Card from "./Card";
import SendEmail from "./SendEmail";

interface ResultsProps {
  data: {
    visa: string;
    budget: {
      totalUSD: number;
      perDayUSD: number;
      breakdown: {
        accommodation: number;
        food: number;
        transportation: number;
        activities: number;
        stay: number;
      };
    };
    local: {
      apps: string[];
      eSIM: string[];
    };
    currency: {
      localCurrency: string;
      exchangeRate: number; // New field
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
        ["Accommodation", data.budget.breakdown.accommodation, (data.budget.breakdown.accommodation * data.currency.exchangeRate).toFixed(2)],
        ["Food", data.budget.breakdown.food, (data.budget.breakdown.food * data.currency.exchangeRate).toFixed(2)],
        ["Transportation", data.budget.breakdown.transportation, (data.budget.breakdown.transportation * data.currency.exchangeRate).toFixed(2)],
        ["Activities", data.budget.breakdown.activities, (data.budget.breakdown.activities * data.currency.exchangeRate).toFixed(2)],
        ["Stay", data.budget.breakdown.stay, (data.budget.breakdown.stay * data.currency.exchangeRate).toFixed(2)],
        ["Total / Day", data.budget.perDayUSD, (data.budget.perDayUSD * data.currency.exchangeRate).toFixed(2)],
        ["Total Trip", data.budget.totalUSD, (data.budget.totalUSD * data.currency.exchangeRate).toFixed(2)],
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
    y = addText(`Exchange Rate (USD → ${data.currency.localCurrency}): ${data.currency.exchangeRate}`, 14, y);
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
            Accommodation: ${data.budget.breakdown.accommodation} (~{(data.budget.breakdown.accommodation * data.currency.exchangeRate).toFixed(2)} {data.currency.localCurrency})
          </li>
          <li>
            Food: ${data.budget.breakdown.food} (~{(data.budget.breakdown.food * data.currency.exchangeRate).toFixed(2)} {data.currency.localCurrency})
          </li>
          <li>
            Transportation: ${data.budget.breakdown.transportation} (~{(data.budget.breakdown.transportation * data.currency.exchangeRate).toFixed(2)} {data.currency.localCurrency})
          </li>
          <li>
            Activities: ${data.budget.breakdown.activities} (~{(data.budget.breakdown.activities * data.currency.exchangeRate).toFixed(2)} {data.currency.localCurrency})
          </li>
          <li>
            Stay: ${data.budget.breakdown.stay} (~{(data.budget.breakdown.stay * data.currency.exchangeRate).toFixed(2)} {data.currency.localCurrency})
          </li>
        </ul>
        <p>
          Total / Day: ${data.budget.perDayUSD} (~{(data.budget.perDayUSD * data.currency.exchangeRate).toFixed(2)} {data.currency.localCurrency})
        </p>
        <p>
          Total Trip: ${data.budget.totalUSD} (~{(data.budget.totalUSD * data.currency.exchangeRate).toFixed(2)} {data.currency.localCurrency})
        </p>
      </Card>

      <Card title="Local Tools & Connectivity">
        <p>Apps: {data.local.apps.join(", ")}</p>
        <p>eSIMs: {data.local.eSIM.join(", ")}</p>
      </Card>

      <Card title="Currency & Exchange Tips">
        <p>Local Currency: {data.currency.localCurrency}</p>
        <p>Exchange Rate (USD → {data.currency.localCurrency}): {data.currency.exchangeRate}</p>
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