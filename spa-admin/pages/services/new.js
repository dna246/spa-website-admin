import ServiceForm from "@/components/ServiceForm";
import Layout from "@/components/Layout";

export default function NewService() {
    return (
        <Layout>
            <h1>Thêm Dịch vụ mới</h1>
            <ServiceForm/>
        </Layout>
    )
}