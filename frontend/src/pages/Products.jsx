// Products page placeholder
import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import styles from "./PageStyles.module.css";

function Products() {
  const [business, setBusiness] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImageName, setUploadedImageName] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [bulkMessage, setBulkMessage] = useState("");
  const [pendingBulkFile, setPendingBulkFile] = useState(null);
  const bulkInputRef = useRef(null);

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
    setBusiness(res.data);
    return res.data;
  };

  const fetchData = async () => {
    const biz = await fetchBusiness();

    if (!biz) return;

    const catRes = await API.get(`/api/categories/${biz._id}`);
    const prodRes = await API.get(`/api/products/${biz._id}`);

    setCategories(catRes.data);
    setProducts(prodRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();

    await API.post("/api/categories", {
      businessId: business._id,
      name: categoryName
    });

    setCategoryName("");
    fetchData();
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageBase64 = await fileToBase64(file);

    const res = await API.post("/api/upload/image", {
      imageBase64
    });

    setImageUrl(res.data.imageUrl);
    setUploadedImageName(file.name);
  };

  const findCategoryName = (categoryId) => {
    const id = typeof categoryId === "object" && categoryId ? categoryId._id : categoryId;
    return categories.find((cat) => cat._id === id)?.name || "Uncategorized";
  };

  const clearProductForm = () => {
    setCategoryId("");
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setUploadedImageName("");
    setEditingProduct(null);
  };

  const openAddProductModal = () => {
    clearProductForm();
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    const categoryValue = product.categoryId && typeof product.categoryId === "object"
      ? product.categoryId._id
      : product.categoryId || "";

    setCategoryId(categoryValue);
    setName(product.name || "");
    setDescription(product.description || "");
    setPrice(product.price?.toString() || "");
    setImageUrl(product.imageUrl || "");
    setUploadedImageName("");
    setIsProductModalOpen(true);
  };

  const addProduct = async () => {
    await API.post("/api/products", {
      businessId: business._id,
      categoryId,
      name,
      description,
      price: Number(price),
      imageUrl
    });

    clearProductForm();
    fetchData();
  };

  const updateProduct = async () => {
    await API.put(`/api/products/${editingProduct._id}`, {
      categoryId,
      name,
      description,
      price: Number(price),
      imageUrl
    });

    clearProductForm();
    setIsProductModalOpen(false);
    fetchData();
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (editingProduct) {
      await updateProduct();
    } else {
      await addProduct();
      setIsProductModalOpen(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const normalizedSearch = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !normalizedSearch ||
      product.name?.toLowerCase().includes(normalizedSearch) ||
      product.description?.toLowerCase().includes(normalizedSearch);

    const matchesCategory = !filterCategory || product.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const downloadCsvTemplate = () => {
    const rows = [
      ["categoryname", "name", "description", "price", "imageUrl"],
      ["<category_name>", "Cheese Burger", "Delicious beef burger", "199", "https://example.com/image.jpg"]
    ];

    const csvContent = rows
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkUploadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPendingBulkFile(file);
    setBulkMessage(`Selected file: ${file.name}. Please confirm to upload.`);
    if (bulkInputRef.current) {
      bulkInputRef.current.value = null;
    }
  };

  const confirmBulkUpload = async () => {
    if (!pendingBulkFile) return;

    const formData = new FormData();
    formData.append("file", pendingBulkFile);

    try {
      setBulkMessage("Uploading products...");
      await API.post("/api/products/bulk-upload", formData);
      setBulkMessage("Bulk upload completed successfully.");
      setPendingBulkFile(null);
      fetchData();
    } catch (error) {
      setBulkMessage("Bulk upload failed. Please check your CSV format.");
    }
  };

  const cancelBulkUpload = () => {
    setPendingBulkFile(null);
    setBulkMessage("");
    if (bulkInputRef.current) {
      bulkInputRef.current.value = null;
    }
  };

  const deleteProduct = async (id) => {
    await API.delete(`/api/products/${id}`);
    fetchData();
  };

  return (
    <DashboardLayout>
      <div className={styles.pageBody}>
        <Link className={styles.backLink} to="/dashboard">
          Back to dashboard
        </Link>

        <Header
          title="Products & Categories"
          subtitle="Manage categories, products, and images for your menu."
        />

        {!business && <p className={styles.helperText}>Please create business first.</p>}

        {business && (
          <>
            <div className={styles.cardGrid}>
              <form onSubmit={addCategory} className={`${styles.formCard} ${styles.formCardCompact}`}>
                <div className={styles.formSection}>
                  <h3 className={styles.formSectionTitle}>Add Category</h3>
                  <div className={`${styles.formGroup} ${styles.formGroupCompact}`}>
                    <label htmlFor="categoryName" className={styles.label}>
                      Category Name
                    </label>
                    <input
                      id="categoryName"
                      className={`${styles.input} ${styles.compactInput}`}
                      placeholder="Category Name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </div>
                </div>

                <div className={`${styles.buttonRow} ${styles.buttonRowCompact}`}>
                  <button className={`${styles.primaryButton} ${styles.compactButton}`} type="submit">
                    Add Category
                  </button>
                </div>
              </form>
            </div>

            <div className={styles.panelCard}>
              <div className={styles.actionRow}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className={styles.filterSelect}
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.actionRow}>
                <button className={`${styles.primaryButton} ${styles.actionButton}`} type="button" onClick={openAddProductModal}>
                  Add Product
                </button>
                <button className={`${styles.secondaryButton} ${styles.actionButton}`} type="button" onClick={downloadCsvTemplate}>
                  Download CSV Template
                </button>
                <button
                  className={`${styles.secondaryButton} ${styles.actionButton}`}
                  type="button"
                  onClick={() => bulkInputRef.current?.click()}
                >
                  Bulk Upload
                </button>
                <input
                  ref={bulkInputRef}
                  type="file"
                  accept=".csv"
                  style={{ display: "none" }}
                  onChange={handleBulkUploadFile}
                />
              </div>
              {bulkMessage && <p className={styles.fieldHint}>{bulkMessage}</p>}
              {pendingBulkFile && (
                <div className={styles.buttonRow} style={{ marginTop: 12 }}>
                  <button
                    className={`${styles.primaryButton} ${styles.actionButton}`}
                    type="button"
                    onClick={confirmBulkUpload}
                  >
                    Confirm Bulk Upload
                  </button>
                  <button
                    className={`${styles.secondaryButton} ${styles.actionButton}`}
                    type="button"
                    onClick={cancelBulkUpload}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className={styles.cardGrid}>
              {filteredProducts.length === 0 ? (
                <p className={styles.helperText}>
                  No products found. Use search or filters to narrow results.
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product._id} className={styles.productCard}>
                    <div className={styles.productCardHeader}>
                      {product.imageUrl ? (
                        <div className={styles.productCardImage}>
                          <img src={product.imageUrl} alt={product.name} />
                        </div>
                      ) : (
                        <div className={styles.productCardImagePlaceholder}>
                          No image
                        </div>
                      )}
                      <div className={styles.productCardMeta}>
                        <span className={styles.productCategory}>
                          {findCategoryName(product.categoryId)}
                        </span>
                        <h3>{product.name}</h3>
                        <p className={styles.sectionHint}>{product.description}</p>
                      </div>
                    </div>

                    <div className={styles.productCardFooter}>
                      <div>
                        <span className={styles.productPrice}>Rs. {product.price}</span>
                      </div>
                      <div className={styles.productActions}>
                        <button
                          className={styles.secondaryButton}
                          type="button"
                          onClick={() => openEditProductModal(product)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.secondaryButton}
                          type="button"
                          onClick={() => deleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {isProductModalOpen && (
              <div className={styles.modalOverlay} onClick={() => setIsProductModalOpen(false)}>
                <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <div>
                      <h3 className={styles.modalTitle}>
                        {editingProduct ? "Edit Product" : "Add Product"}
                      </h3>
                      <p className={styles.fieldHint}>
                        {editingProduct ? "Update existing product details." : "Create a new product for the menu."}
                      </p>
                    </div>
                    <button
                      className={styles.modalClose}
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleProductSubmit} className={styles.modalForm}>
                    <div className={styles.formSection}>
                      <div className={styles.formGroup}>
                        <label htmlFor="modalCategoryId" className={styles.label}>
                          Category
                        </label>
                        <select
                          id="modalCategoryId"
                          className={styles.select}
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="modalName" className={styles.label}>
                          Product Name
                        </label>
                        <input
                          id="modalName"
                          className={styles.input}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Product name"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="modalDescription" className={styles.label}>
                          Description
                        </label>
                        <textarea
                          id="modalDescription"
                          className={styles.textarea}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Product description"
                        />
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="modalPrice" className={styles.label}>
                            Price
                          </label>
                          <input
                            id="modalPrice"
                            className={styles.input}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Price"
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="modalImageUrl" className={styles.label}>
                            Image URL
                          </label>
                          <input
                            id="modalImageUrl"
                            className={styles.input}
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Paste image URL"
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="modalUploadImage" className={styles.label}>
                          Upload Image
                        </label>
                        <input
                          id="modalUploadImage"
                          type="file"
                          accept="image/*"
                          className={styles.fileInput}
                          onChange={uploadImage}
                        />
                        {uploadedImageName && (
                          <p className={styles.fieldHint}>Uploaded: {uploadedImageName}</p>
                        )}
                      </div>
                    </div>

                    <div className={styles.modalFooter}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => {
                          setIsProductModalOpen(false);
                          clearProductForm();
                        }}
                      >
                        Cancel
                      </button>
                      <button className={styles.primaryButton} type="submit">
                        {editingProduct ? "Save Changes" : "Create Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Products;