import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "../../redux/products/operations";
import { selectProducts, selectIsLoading } from "../../redux/products/selectors";
import { selectCategories, selectIsLoading as selectIsCatLoading } from "../../redux/categories/selectors";
import { fetchCategories, addCategory, updateCategory, deleteCategory } from "../../redux/categories/operations";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import css from "./AdminPage.module.css";

const ProductSchema = Yup.object().shape({
    title: Yup.string().required("Başlık gerekli"),
    brand: Yup.string().required("Marka gerekli"),
    price: Yup.number().positive("Fiyat pozitif olmalı").required("Fiyat gerekli"),
    stock: Yup.number().min(0, "Stok 0'dan az olamaz").required("Stok gerekli"),
    description: Yup.string().required("Açıklama gerekli"),
    categoryId: Yup.string().required("Kategori gerekli"),
});

const AdminPage = () => {
    const dispatch = useDispatch();
    const products = useSelector(selectProducts);
    const categories = useSelector(selectCategories);
    const isLoading = useSelector(selectIsLoading);
    const isCatLoading = useSelector(selectIsCatLoading);
    const fileInputRef = useRef(null);
    const catFileInputRef = useRef(null);

    const [editingProduct, setEditingProduct] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isCatFormOpen, setIsCatFormOpen] = useState(false);

    // Image management state
    const [currentImages, setCurrentImages] = useState([]); // Existing URLs
    const [newImageFiles, setNewImageFiles] = useState([]); // Newly selected files
    const [previewUrls, setPreviewUrls] = useState([]); // Previews for new files
    const [catImageFile, setCatImageFile] = useState(null);
    const [catPreviewUrl, setCatPreviewUrl] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts({ perPage: 100 }));
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setNewImageFiles(prev => [...prev, ...files]);

        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...urls]);
    };

    const moveImage = (index, direction, isNew) => {
        if (isNew) {
            const updatedFiles = [...newImageFiles];
            const updatedPreviews = [...previewUrls];
            const newPos = index + direction;

            if (newPos >= 0 && newPos < updatedFiles.length) {
                [updatedFiles[index], updatedFiles[newPos]] = [updatedFiles[newPos], updatedFiles[index]];
                [updatedPreviews[index], updatedPreviews[newPos]] = [updatedPreviews[newPos], updatedPreviews[index]];
                setNewImageFiles(updatedFiles);
                setPreviewUrls(updatedPreviews);
            }
        } else {
            const updated = [...currentImages];
            const newPos = index + direction;
            if (newPos >= 0 && newPos < updated.length) {
                [updated[index], updated[newPos]] = [updated[newPos], updated[index]];
                setCurrentImages(updated);
            }
        }
    };

    const removeImage = (index, isNew) => {
        if (isNew) {
            setNewImageFiles(prev => prev.filter((_, i) => i !== index));
            setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        } else {
            setCurrentImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            dispatch(deleteProduct(id))
                .unwrap()
                .then(() => toast.success("Ürün silindi"))
                .catch((err) => toast.error(err));
        }
    };

    const handleSubmit = (values, { resetForm }) => {
        const formData = new FormData();

        Object.keys(values).forEach(key => {
            formData.append(key, values[key]);
        });

        // Add remaining existing images
        currentImages.forEach(img => formData.append('images', img));

        // Add new files
        newImageFiles.forEach(file => formData.append('images', file));

        const action = editingProduct
            ? updateProduct({ productId: editingProduct._id, productData: formData })
            : addProduct(formData);

        dispatch(action)
            .unwrap()
            .then(() => {
                toast.success(editingProduct ? "Ürün güncellendi" : "Ürün eklendi");
                resetForm();
                resetImageState();
                setIsFormOpen(false);
                setEditingProduct(null);
            })
            .catch((err) => toast.error(err));
    };

    const resetImageState = () => {
        setCurrentImages([]);
        setNewImageFiles([]);
        setPreviewUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setCurrentImages(product.images || []);
        setNewImageFiles([]);
        setPreviewUrls([]);
        setIsFormOpen(true);
        setIsCatFormOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategorySubmit = (values, { resetForm }) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description || "");
        if (catImageFile) formData.append("image", catImageFile);

        const action = editingCategory
            ? updateCategory({ categoryId: editingCategory._id, categoryData: formData })
            : addCategory(formData);

        dispatch(action)
            .unwrap()
            .then(() => {
                toast.success(editingCategory ? "Kategori güncellendi" : "Kategori eklendi");
                resetForm();
                setCatImageFile(null);
                setCatPreviewUrl(null);
                setIsCatFormOpen(false);
                setEditingCategory(null);
            })
            .catch((err) => toast.error(err));
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setCatImageFile(null);
        setCatPreviewUrl(category.image || null);
        setIsCatFormOpen(true);
        setIsFormOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
            dispatch(deleteCategory(id))
                .unwrap()
                .then(() => toast.success("Kategori silindi"))
                .catch((err) => toast.error(err));
        }
    };

    const placeholderImage = "/assets/laveline-yazılı-logo-nobackground.png";

    return (
        <div className={css.container}>
            <header className={css.header}>
                <h1 className={css.title}>Yönetim Paneli</h1>
                <div className={css.headerActions}>
                    <button
                        className={css.catBtn}
                        onClick={() => {
                            setIsCatFormOpen(!isCatFormOpen);
                            setIsFormOpen(false);
                        }}
                    >
                        {isCatFormOpen ? "Kapat" : "Kategoriler"}
                    </button>
                    <button
                        className={css.addBtn}
                        onClick={() => {
                            setEditingProduct(null);
                            resetImageState();
                            setIsFormOpen(!isFormOpen);
                            setIsCatFormOpen(false);
                        }}
                    >
                        {isFormOpen ? "Kapat" : "Yeni Ürün Ekle"}
                    </button>
                </div>
            </header>

            {isCatFormOpen && (
                <div className={css.formSection}>
                    <h2 className={css.sectionTitle}>{editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}</h2>
                    <Formik
                        initialValues={{
                            name: editingCategory?.name || "",
                            description: editingCategory?.description || ""
                        }}
                        enableReinitialize
                        onSubmit={handleCategorySubmit}
                    >
                        {() => (
                            <Form className={css.adminForm}>
                                <div className={css.fieldGroup}>
                                    <label>Kategori Adı</label>
                                    <Field name="name" className={css.input} required />
                                </div>
                                <div className={css.fieldGroup}>
                                    <label>Açıklama (Opsiyonel)</label>
                                    <Field as="textarea" name="description" className={css.textarea} />
                                </div>
                                <div className={css.fieldGroup}>
                                    <label>Kategori Görseli</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={catFileInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setCatImageFile(file);
                                                setCatPreviewUrl(URL.createObjectURL(file));
                                            }
                                        }}
                                        className={css.fileInput}
                                    />
                                    {catPreviewUrl && (
                                        <div className={css.imagePreviewSingle}>
                                            <img src={catPreviewUrl} alt="cat-preview" />
                                        </div>
                                    )}
                                </div>
                                <div className={css.formFooter}>
                                    <button type="submit" className={css.submitBtn} disabled={isCatLoading}>
                                        {editingCategory ? "Güncelle" : "Kaydet"}
                                    </button>
                                    {editingCategory && (
                                        <button
                                            type="button"
                                            className={css.cancelBtn}
                                            onClick={() => {
                                                setEditingCategory(null);
                                                setIsCatFormOpen(false);
                                            }}
                                        >
                                            İptal
                                        </button>
                                    )}
                                </div>
                            </Form>
                        )}
                    </Formik>

                    {!editingCategory && (
                        <div className={css.listSubsection}>
                            <h3>Mevcut Kategoriler</h3>
                            <div className={css.tableWrapper}>
                                <table className={css.table}>
                                    <thead>
                                        <tr>
                                            <th>Görsel</th>
                                            <th>Ad</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map(cat => (
                                            <tr key={cat._id}>
                                                <td><img src={cat.image || placeholderImage} alt={cat.name} className={css.tableThumb} /></td>
                                                <td>{cat.name}</td>
                                                <td>
                                                    <div className={css.actions}>
                                                        <button onClick={() => handleEditCategory(cat)} className={css.editMiniBtn}>Düzenle</button>
                                                        <button onClick={() => handleDeleteCategory(cat._id)} className={css.delMiniBtn}>Sil</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {isFormOpen && (
                <div className={css.formSection}>
                    <h2 className={css.sectionTitle}>{editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h2>
                    <Formik
                        initialValues={{
                            title: editingProduct?.title || "",
                            brand: editingProduct?.brand || "",
                            price: editingProduct?.price || 0,
                            stock: editingProduct?.stock || 0,
                            description: editingProduct?.description || "",
                            categoryId: editingProduct?.categoryId?._id || editingProduct?.categoryId || "",
                        }}
                        validationSchema={ProductSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {() => (
                            <Form className={css.adminForm}>
                                <div className={css.fieldGroup}>
                                    <label>Ürün Adı</label>
                                    <Field name="title" className={css.input} />
                                    <ErrorMessage name="title" component="div" className={css.error} />
                                </div>

                                <div className={css.row}>
                                    <div className={css.fieldGroup}>
                                        <label>Marka</label>
                                        <Field name="brand" className={css.input} />
                                        <ErrorMessage name="brand" component="div" className={css.error} />
                                    </div>
                                    <div className={css.fieldGroup}>
                                        <label>Kategori</label>
                                        <Field as="select" name="categoryId" className={css.input}>
                                            <option value="">Kategori Seçin</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="categoryId" component="div" className={css.error} />
                                    </div>
                                </div>

                                <div className={css.row}>
                                    <div className={css.fieldGroup}>
                                        <label>Fiyat (TL)</label>
                                        <Field name="price" type="number" className={css.input} />
                                        <ErrorMessage name="price" component="div" className={css.error} />
                                    </div>
                                    <div className={css.fieldGroup}>
                                        <label>Stok</label>
                                        <Field name="stock" type="number" className={css.input} />
                                        <ErrorMessage name="stock" component="div" className={css.error} />
                                    </div>
                                </div>

                                <div className={css.fieldGroup}>
                                    <label>Açıklama</label>
                                    <Field as="textarea" name="description" className={css.textarea} />
                                    <ErrorMessage name="description" component="div" className={css.error} />
                                </div>

                                <div className={css.imageManagement}>
                                    <label>Ürün Görselleri</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                        className={css.fileInput}
                                    />

                                    <div className={css.gallery}>
                                        {/* Existing Images */}
                                        {currentImages.map((src, idx) => (
                                            <div key={`cur-${idx}`} className={css.imageItem}>
                                                <img src={src} alt="existing" />
                                                <div className={css.imageActions}>
                                                    <button type="button" onClick={() => moveImage(idx, -1, false)}>‹</button>
                                                    <button type="button" onClick={() => removeImage(idx, false)} className={css.delBtnX}>×</button>
                                                    <button type="button" onClick={() => moveImage(idx, 1, false)}>›</button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* New Images */}
                                        {previewUrls.map((src, idx) => (
                                            <div key={`new-${idx}`} className={`${css.imageItem} ${css.newImage}`}>
                                                <img src={src} alt="new" />
                                                <div className={css.imageActions}>
                                                    <button type="button" onClick={() => moveImage(idx, -1, true)}>‹</button>
                                                    <button type="button" onClick={() => removeImage(idx, true)} className={css.delBtnX}>×</button>
                                                    <button type="button" onClick={() => moveImage(idx, 1, true)}>›</button>
                                                </div>
                                                <span className={css.newBadge}>Yeni</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={css.formFooter}>
                                    <button type="submit" className={css.submitBtn} disabled={isLoading}>
                                        {editingProduct ? "Güncelle" : "Kaydet"}
                                    </button>
                                    {editingProduct && (
                                        <button
                                            type="button"
                                            className={css.cancelBtn}
                                            onClick={() => {
                                                setEditingProduct(null);
                                                setIsFormOpen(false);
                                            }}
                                        >
                                            İptal
                                        </button>
                                    )}
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            <div className={css.listSection}>
                <h2 className={css.sectionTitle}>Mevcut Ürünler</h2>
                <div className={css.tableWrapper}>
                    <table className={css.table}>
                        <thead>
                            <tr>
                                <th>Görsel</th>
                                <th>Ürün</th>
                                <th>Kategori</th>
                                <th>Fiyat</th>
                                <th>Stok</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        <img
                                            src={product.images?.[0] || placeholderImage}
                                            alt={product.title}
                                            className={css.tableThumb}
                                        />
                                    </td>
                                    <td>
                                        <div className={css.productCell}>
                                            <span className={css.productTitle}>{product.title}</span>
                                            <span className={css.productBrand}>{product.brand}</span>
                                        </div>
                                    </td>
                                    <td>{categories.find(c => c._id === (product.categoryId?._id || product.categoryId))?.name || "—"}</td>
                                    <td>{product.price} TL</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <div className={css.actions}>
                                            <button onClick={() => handleEdit(product)} className={css.editMiniBtn}>Düzenle</button>
                                            <button onClick={() => handleDelete(product._id)} className={css.delMiniBtn}>Sil</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
