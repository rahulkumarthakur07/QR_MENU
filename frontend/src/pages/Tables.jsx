// Tables page placeholder
import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import styles from "./PageStyles.module.css";

function Tables() {
  const [business, setBusiness] = useState(null);
  const [numberOfTables, setNumberOfTables] = useState(5);
  const [tables, setTables] = useState([]);

  const fetchBusiness = async () => {
    const res = await API.get("/api/business/my-business");

    setBusiness(res.data);

    if (res.data) {
      fetchTables(res.data._id);
    }
  };

  const fetchTables = async (businessId) => {
    const res = await API.get(`/api/tables/${businessId}`);
    setTables(res.data);
  };

  useEffect(() => {
    fetchBusiness();
  }, []);

  const generateTables = async (e) => {
    e.preventDefault();

    const res = await API.post("/api/tables/generate", {
      businessId: business._id,
      numberOfTables: Number(numberOfTables)
    });

    setTables(res.data);
  };

  const downloadQR = (qrCodeDataUrl, tableNumber) => {
    const link = document.createElement("a");

    link.href = qrCodeDataUrl;
    link.download = `table-${tableNumber}-qr.png`;

    link.click();
  };

  const resetTableQr = async (tableId) => {
    await API.put(`/api/tables/${tableId}/reset`);
    fetchTables(business._id);
  };

  const deleteTableQr = async (tableId) => {
    await API.delete(`/api/tables/${tableId}`);
    fetchTables(business._id);
  };

  return (
    <DashboardLayout>
      <div className={styles.pageBody}>
        <Link className={styles.backLink} to="/dashboard">
          Back to dashboard
        </Link>

        <Header
          title="Tables & QR Codes"
          subtitle="Generate QR codes and manage table assignments with ease."
        />

        {!business && <p className={styles.helperText}>Please create business first.</p>}

        {business && (
          <>
            <form onSubmit={generateTables} className={styles.formCard}>
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Generate Tables</h3>
                <div className={styles.formGroup}>
                  <label htmlFor="numberOfTables" className={styles.label}>
                    Number of Tables
                  </label>
                  <input
                    id="numberOfTables"
                    className={styles.input}
                    type="number"
                    value={numberOfTables}
                    onChange={(e) => setNumberOfTables(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.buttonRow}>
                <button className={styles.primaryButton} type="submit">
                  Generate QR Codes
                </button>
              </div>
            </form>

            <div className={styles.cardGrid}>
              {tables.map((table) => (
                <div key={table._id} className={styles.tableCard}>
                  <div className={styles.formRow}>
                    <div>
                      <h3>Table {table.tableNumber}</h3>
                      <p className={styles.fieldHint} style={{ marginTop: 8 }}>
                        Current QR is {table.isActive ? "active" : "inactive"}
                      </p>
                    </div>
                    <span className={styles.statusBadge}>
                      {table.isActive ? "QR ready" : "Expired"}
                    </span>
                  </div>

                  <img
                    src={table.qrCodeDataUrl}
                    alt="QR code"
                    style={{ borderRadius: 14, width: "100%", maxWidth: 220 }}
                  />
                  <p className={styles.sectionHint}>
                    <a href={table.menuUrl} target="_blank" rel="noreferrer" className={styles.linkText}>
                      {table.menuUrl}
                    </a>
                  </p>

                  <div className={styles.buttonRow}>
                    <button
                      className={styles.secondaryButton}
                      type="button"
                      onClick={() => downloadQR(table.qrCodeDataUrl, table.tableNumber)}
                    >
                      Download QR
                    </button>
                    <button
                      className={styles.secondaryButton}
                      type="button"
                      onClick={() => resetTableQr(table._id)}
                    >
                      Reset QR
                    </button>
                    <button
                      className={styles.secondaryButton}
                      type="button"
                      onClick={() => deleteTableQr(table._id)}
                    >
                      Delete QR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Tables;