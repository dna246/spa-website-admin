import React, {useEffect, useState} from "react";
import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import axios from "axios";

export default function DeleteServicePage() {
    const router = useRouter();
    const [serviceInfo, setServiceInfo] = useState();
    const {id}  = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/services?id='+ id).then(res => {
            setServiceInfo(res.data);
        })
    }, [id])
    function goBack(){
        router.push('/services')
    }

    async function deleteService(){
        await axios.delete('/api/services?id='+id)
        goBack()
    }
    return (
        <Layout>
            <h1 className="text-center">Do you really want to delete &quot;{serviceInfo?.title}&quot;?</h1>
            <div className="flex gap-2 justify-center">
                <button className="btn-red" onClick={deleteService}>Yes</button>
                <button className="btn-default" onClick={goBack}>No</button>
            </div>
        </Layout>
    )
}
