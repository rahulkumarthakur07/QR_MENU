import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import { Upload, AlertCircle } from "lucide-react";
import styles from "./BusinessSettings.module.css";

function BusinessSettings() {
  const [business, setBusiness] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [geoFenceRadius, setGeoFenceRadius] = useState(50);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };

      reader.onerror = (error) => reject(error);
    });
  };

  const fetchBusiness = async () => {
    const res = await API.get("/api/business/my-business");

    if (res.data) {
      setBusiness(res.data);
      setBusinessName(res.data.businessName);
      setLogoUrl(res.data.logoUrl || "");
      setAddress(res.data.address || "");
      setLat(res.data.location?.lat || "");
      setLng(res.data.location?.lng || "");
      setGeoFenceRadius(res.data.geoFenceRadius || 50);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, []);

  const uploadLogo = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageBase64 = await fileToBase64(file);

    const res = await API.post("/api/upload/image", {
      imageBase64
    });

    setLogoUrl(res.data.imageUrl);
    setMessage("Logo uploaded successfully");
    setMessageType("success");
    setTimeout(() => setMessage(""), 3000);
  };

  const saveBusiness = async (e) => {
    e.preventDefault();

    const payload = {
      businessName,
      logoUrl,
      address,
      lat: Number(lat),
      lng: Number(lng),
      geoFenceRadius: Number(geoFenceRadius)
    };

    if (business?._id) {
      await API.put(`/api/business/${business._id}`, payload);
      setMessage("Business updated successfully");
      setMessageType("success");
    } else {
      await API.post("/api/business", payload);
      setMessage("Business created successfully");
      setMessageType("success");
    }

    setTimeout(() => setMessage(""), 3000);
    fetchBusiness();
  };

  return (
    <DashboardLayout>
      <Header 
        title="Business Settings" 
        subtitle="Configure your restaurant details, location, and preferences"
      />

      <div className={styles.content}>
        {/* Message Alert */}
        {message && (
          <div className={`${styles.alert} ${styles[messageType]}`}>
            <p>{message}</p>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={saveBusiness} className={styles.formCard}>
          <div className={styles.formSection}>
            <h3 className={styles.formTitle}>Basic Information</h3>

            {/* Business Name */}
            <div className={styles.formGroup}>
              <label htmlFor="businessName" className={styles.label}>
                Business Name *
              </label>
              <input
                id="businessName"
                type="text"
                placeholder="e.g., The Italian Kitchen"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>

            {/* Logo Upload */}
            <div className={styles.formGroup}>
              <label htmlFor="logo" className={styles.label}>
                Business Logo
              </label>
              <label htmlFor="logo" className={styles.uploadArea}>
                <input
                  id="logo"
                  type="file"
                  onChange={uploadLogo}
                  className={styles.fileInput}
                  accept="image/*"
                />
                <div className={styles.uploadContent}>
                  <Upload size={24} />
                  <p>Click to upload or drag and drop</p>
                  <span className={styles.uploadHint}>PNG, JPG, GIF up to 5MB</span>
                </div>
              </label>

              {logoUrl && (
                <div className={styles.logoPreview}>
                  <p className={styles.previewLabel}>Logo Preview</p>
                  <img src={logoUrl} alt="Business Logo" className={styles.logo} />
                </div>
              )}
            </div>
          </div>

          {/* Location Section */}
          <div className={styles.formSection}>
            <h3 className={styles.formTitle}>Location</h3>

            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>
                Address *
              </label>
              <input
                id="address"
                type="text"
                placeholder="Street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="lat" className={styles.label}>
                  Latitude *
                </label>
                <input
                  id="lat"
                  type="number"
                  step="0.0001"
                  placeholder="e.g., 40.7128"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lng" className={styles.label}>
                  Longitude *
                </label>
                <input
                  id="lng"
                  type="number"
                  step="0.0001"
                  placeholder="e.g., -74.0060"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.infoBox}>
              <AlertCircle size={16} />
              <p>Find your location on Google Maps, copy the coordinates from the URL or by clicking on the map.</p>
            </div>
          </div>

          {/* Geo Fence Section */}
          <div className={styles.formSection}>
            <h3 className={styles.formTitle}>Geo-Fence Settings</h3>

            <div className={styles.formGroup}>
              <label htmlFor="radius" className={styles.label}>
                Geo-Fence Radius (meters)
              </label>
              <input
                id="radius"
                type="number"
                min="10"
                max="5000"
                step="10"
                placeholder="50"
                value={geoFenceRadius}
                onChange={(e) => setGeoFenceRadius(e.target.value)}
              />
              <p className={styles.fieldHint}>
                Customers must be within this distance to order. Default: 50 meters.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn}>
              Save Business Settings
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default BusinessSettings;