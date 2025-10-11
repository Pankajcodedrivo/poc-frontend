import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Card from "./Card";
import SendEmail from "./SendEmail";
import { useState } from "react";

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
        miscellaneous: number;
      };
    };
    local: {
      destination: string;
      apps: {
        transportation: string[];
        lodging: string[];
        communication: string[];
        budgetTravel: string[];
        navigation: string[];
        utilities: string[];
      };
      eSIM: string[];
    }[];
    currencies: {
      destination: string;
      localCurrency: string;
      exchangeRate: number;
      exchangeTips: string[];
    }[];
    safety: {
      destination: string;
      generalSafety: string;
      scamsAndReviews:string;
      emergencyNumbers: {
        police: number;
        ambulanceFire: number;
      };
      travelInsurance: string;
    }[];
    mini: string[];
  };
}

const Results = ({ data }: ResultsProps) => {
  const [open, setOpen] = useState(false);

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

    let y = 20;
    doc.setFontSize(18);
    doc.text("Travel Planner - Results", 14, y);
    y += 10;

    // Visa
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = data.visa;
    const visaText = tempDiv.innerText || "";
    y = addText("Visa & Entry", 14, y, 10, 14);
    y = addText(visaText, 14, y);

    // Budget Table
    autoTable(doc, {
      startY: y + 5,
      head: [["Category", "USD"]],
      body: [
        ["Accommodation", data.budget.breakdown.accommodation],
        ["Food", data.budget.breakdown.food],
        ["Transportation", data.budget.breakdown.transportation],
        ["Activities", data.budget.breakdown.activities],
        ["Miscellaneous", data.budget.breakdown.miscellaneous],
        ["Total / Day", data.budget.perDayUSD],
        ["Total Trip", data.budget.totalUSD],
      ],
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Local Apps (combined)
    const combinedApps: { [key: string]: Set<string> } = {};
    data.local.forEach(localItem => {
      Object.entries(localItem.apps).forEach(([category, apps]) => {
        if (!combinedApps[category]) combinedApps[category] = new Set();
        apps.forEach(app => combinedApps[category].add(app));
      });
    });
    y = addText("Local Tools & Connectivity", 14, y, 10, 14);
    Object.entries(combinedApps).forEach(([category, appsSet]) => {
      y = addText(
        `${category.charAt(0).toUpperCase() + category.slice(1)}: ${Array.from(
          appsSet
        ).join(", ")}`,
        14,
        y
      );
    });
    const combinedESIMs = Array.from(new Set(data.local.flatMap(l => l.eSIM)));
    y = addText(`eSIMs: ${combinedESIMs.join(", ")}`, 14, y);

    // Currencies
    y = addText("Currencies & Exchange Tips", 14, y + 10, 10, 14);
    data.currencies.forEach((c, idx) => {
      y = addText(
        `${c.localCurrency} (1 USD = ${c.exchangeRate} ${c.localCurrency})`,
        14,
        y
      );
      y = addText(
          `(${data.budget.totalUSD} USD = ${(data.budget.totalUSD * c.exchangeRate).toFixed(2)} ${c.localCurrency})`,
          14,
          y
      );
      c.exchangeTips.forEach(tip => {
        y = addText(`- ${tip}`, 14, y);
      });
      if (idx < data.currencies.length - 1) y = addText("------------------------------", 14, y);
    });

    // Safety
    y = addText("Safety & Emergency", 14, y + 10, 10, 14);
    data.safety.forEach((s, idx) => {
      y = addText(s.generalSafety, 14, y);

      const scamsAndReviewsDiv = document.createElement("div");
      scamsAndReviewsDiv.innerHTML = s.scamsAndReviews;
      const scamsAndReviewsText = scamsAndReviewsDiv.innerText || "";
      y = addText(scamsAndReviewsText, 14, y);
 
      y = addText(
        `Emergency — Police: ${s.emergencyNumbers.police}, Ambulance/Fire: ${s.emergencyNumbers.ambulanceFire}`,
        14,
        y
      );
        // 🧩 Convert the travelInsurance HTML to plain text for PDF
      const tempTravelDiv = document.createElement("div");
      tempTravelDiv.innerHTML = s.travelInsurance;
      const travelText = tempTravelDiv.innerText || "";
      // 🧾 Add Travel Insurance section
      y = addText("Travel Insurance:", 14, y, 10, 14);
      y = addText(travelText, 14, y);
      if (idx < data.safety.length - 1) y = addText("------------------------------", 14, y);
    });

    // Mini Plan
    y = addText("Mini Plan", 14, y + 10, 10, 14);
    data.mini.forEach((item, idx) => {
      y = addText(`${idx + 1}. ${item}`, 14, y);
    });

    doc.save("travel-plan.pdf");
  };

  return (
    <div className="results">
      {/* Visa */}
      <Card title="Visa & Entry">
        <div dangerouslySetInnerHTML={{ __html: data.visa }} />
      </Card>

      {/* Budget */}
      <Card title="Budget Breakdown">
        <ul>
          {Object.entries(data.budget.breakdown).map(([key, value]) => (
            <li key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: ${value}
            </li>
          ))}
        </ul>
        <p>Total / Day: ${data.budget.perDayUSD}</p>
        <p>Total Trip: ${data.budget.totalUSD}</p>
      </Card>

      {/* Local Apps — separate per destination with HR after div */}
       <Card title="Local Tools & Connectivity">
        {(() => {
          // Combine all apps by category
          const combinedApps: { [key: string]: Set<string> } = {};
          data.local.forEach(localItem => {
            Object.entries(localItem.apps).forEach(([category, apps]) => {
              if (!combinedApps[category]) combinedApps[category] = new Set();
              apps.forEach(app => combinedApps[category].add(app));
            });
          });

          return Object.entries(combinedApps).map(([category, appsSet]) => (
            <p key={category}>
              <strong>{category.charAt(0).toUpperCase() + category.slice(1)}:</strong>{" "}
              {Array.from(appsSet).join(", ")}
            </p>
          ));
        })()}

        <p>
          <strong>eSIMs:</strong>{" "}
          {Array.from(
            new Set(data.local.flatMap(localItem => localItem.eSIM))
          ).join(", ")}
        </p>
      </Card>


      {/* Currencies — separate per destination with HR after div */}
      <Card title="Currencies & Exchange Tips">
        {data.currencies.map((c, idx) => (
          <div key={idx}>
            <div style={{ marginBottom: "10px" }}>
              <p>
                {c.localCurrency} (1 USD = {c.exchangeRate} {c.localCurrency})
              </p>
              <p>
                ({data.budget.totalUSD} USD =  {(data.budget.totalUSD * c.exchangeRate).toFixed(2)} {c.localCurrency})
              </p>
              <ul>
                {c.exchangeTips.map((tip, t) => (
                  <li key={t}>{tip}</li>
                ))}
              </ul>
            </div>
            {idx < data.currencies.length - 1 && <hr style={{ marginBottom: "10px" }} />}
          </div>
        ))}
      </Card>

      {/* Safety — separate per destination with HR after div */}
      <Card title="Safety & Emergency">
        {data.safety.map((s, idx) => (
          <div key={idx}>
            <div style={{ marginBottom: "10px" }}>
              <p>{s.generalSafety}</p>
              <div dangerouslySetInnerHTML={{ __html: s.scamsAndReviews }} />
              <p>
                Emergency — Police: {s.emergencyNumbers.police}, Ambulance/Fire:{" "}
                {s.emergencyNumbers.ambulanceFire}
              </p>

              <div>
                <strong>Travel Insurance:</strong>
                <div dangerouslySetInnerHTML={{ __html: s.travelInsurance }} />
              </div>
            </div>
            {idx < data.safety.length - 1 && <hr style={{ marginBottom: "10px" }} />}
          </div>
        ))}
      </Card>

      {/* Mini Plan */}
      <Card title="Mini Plan">
        <ul>
          {data.mini.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </Card>

      {/* Actions */}
      <div className="actions">
        <button className="export-btn" onClick={handleExportPDF}>
          Export to PDF
        </button>
        <button className="btn email-btn" onClick={() => setOpen(true)}>
          Send Email
        </button>
      </div>

      {open && <SendEmail data={data} setOpen={setOpen} />}
    </div>
  );
};

export default Results;