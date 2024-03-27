import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {
    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('')
    const [parentCategory, setParentCategory] = useState('')
    const [categories, setCategories] = useState([])
    useEffect(() => {
        fetchCategories();
    }, [])
    function fetchCategories(){
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }
    async function saveCategories(ev) {
        ev.preventDefault();
        const data = {name, parentCategory}
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories', data);
        }
        setName('')
        fetchCategories();
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Check kỹ nhé',
            text: `Bạn chắc chắn muốn xoá ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Huỷ',
            confirmButtonText: 'Xoá ngay!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            // console.log({result});
            if (result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }
        });
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, {name:'', values:''}];
        })
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent)
    }
    return (
        <Layout>
            <h1>Danh mục hàng</h1>
            <label>{editedCategory
                ? `Chỉnh sửa ${editedCategory.name}`
                : 'Tạo danh mục mới'}
            </label>
            <form onSubmit={saveCategories}>
                <div className="flex gap-1">
                    <input
                        type="text"
                        placeholder={'Tên danh mục'}
                        onChange={ev => setName(ev.target.value)}
                        value={name}
                    />
                    <select onChange={ev => setParentCategory(ev.target.value)}
                            value={parentCategory}
                    >
                        <option value="">Không có danh mục chung</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary py-1">Lưu</button>
            </form>
            <table className="basic mt-4">
                <thead>
                <tr>
                    <td>Danh mục</td>
                    <td>Danh mục chung</td>
                    <td>

                    </td>
                </tr>
                </thead>
                <tbody>
                {categories.length > 0 && categories.map(category => (
                    <tr key={category._id}>
                        <td>{category.name}</td>
                        <td>{category?.parent?.name}</td>
                        <td>
                            <button
                                onClick={() => editCategory(category)}
                                className="btn-primary mr-1"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => deleteCategory(category)}

                                className="btn-primary">Xoá</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Layout>
    );
}
export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
));