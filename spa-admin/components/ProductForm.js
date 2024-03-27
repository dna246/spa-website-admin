import {useRouter} from "next/router";
import axios from "axios";
import {useEffect, useState} from "react";
import Spinner from "@/components/Spinner";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: existingCategory,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(existingCategory || '')
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || [])
    const [goToProducts, setGoToProducts] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter();
    const [categories, setCategories] = useState([])
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    },[])
    async function createProduct(ev) {
        ev.preventDefault();
        const data = {title, description, price, images, category};
        if (_id) {
        //     update
            await axios.put('/api/products', {...data, _id});
        } else {
        //     create product
            await axios.post('/api/products',data);
        }
        setGoToProducts(true)
    }
    if (goToProducts) {
        router.push('/products');
    }

    async function uploadImages(ev){
        const files = ev.target?.files;
        if (files.length > 0) {
            setIsUploading(true)
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            })
            setIsUploading(false)
        }
    }
    function updateImagesOrder(images) {
       setImages(images)
    }

    function removePhoto(linkToRemove) {
        console.log("Attempting to remove:", linkToRemove);
        console.log("Current images:", images);

        const updatedImages = images.filter(link => {
            console.log("Checking link:", link);
            return link !== linkToRemove;
        });

        console.log("Updated images:", updatedImages);
        setImages(updatedImages);
    }

    return (
            <form onSubmit={createProduct}>
                <label>Tên Sản Phẩm</label>
                <input type="text"
                       placeholder="product name"
                       value={title}
                       onChange={ev => setTitle(ev.target.value)}/>
                <label>Danh Mục</label>
                <select value={category}
                        onChange={ev => setCategory(ev.target.value)}
                >
                    <option value="">Uncategorized</option>
                    {categories.length > 0 && categories.map(c => (
                        <option value={c._id}>{c.name}</option>
                    ))}

                </select>
                <label>Hình ảnh</label>
                <div className="mb-2 flex flex-wrap gap-1">
                    <ReactSortable
                        list={images}
                        setList={updateImagesOrder}
                        className="flex flex-wrap gap-1"
                    >
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 relative">
                            <img src={link} alt="" className="rounded-lg"/>
                            <button onClick={() => {removePhoto(link)}} className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-xl p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>

                            </button>
                        </div>
                    ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="h-24 flex items-center" >
                            <Spinner/>
                        </div>
                    )}
                    <label className="w-24 h-24 cursor-pointer text-center flex flex-col text-sm gap-1 text-gray-400 items-center justify-center rounded-lg bg-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        Upload
                        <input type="file" className='hidden' onChange={uploadImages}/>
                    </label>

                </div>
                <label>Mô tả</label>
                <textarea
                    placeholder="description"
                    value={description}
                    onChange={ev => setDescription(ev.target.value)}
                />
                <label>Giá (VND)</label>
                <input
                    type="number"
                    placeholder="price"
                    value={price}
                    onChange={ev => setPrice(ev.target.value)}
                />
                <button
                    type="submit"
                    className="btn-primary">Tạo
                </button>
            </form>
    )
}