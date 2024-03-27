import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import {formatCurrency, formatDate} from "@/lib/utils";


export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    useEffect (() => {
        axios.get('/api/orders').then(res => {
            setOrders(res.data)
        })
    }, [])

    const calculateOrderTotal = (lineItems) => {
        return lineItems.reduce((total, item) => {
            const itemTotal = item.quantity * (item.price_data.unit_amount || 0);
            return total + itemTotal;
        }, 0);
    };


    return (
        <Layout>
            <h1>Quản lý Đơn hàng</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Ngày đặt</th>
                        <th>Thanh toán</th>
                        <th>Người nhận</th>
                        <th>Sản phẩm</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                {orders.length > 0 && orders.map(order => (
                    <tr key={order._id}>
                        <td>{formatDate(order.createdAt)}</td>
                        <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                            {order.paid ? 'YES' : 'NO'}
                        </td>
                        <td>
                                {order.name}<br/>
                                {order.phone} <br/>
                                {order.email} <br/>
                                {order.address} <br/>
                        </td>
                        <td>
                            {order.line_items.map((line, index) => (
                                <div key={index}>
                                    {line.quantity} x {line.price_data?.product_data.name}   <br/>
                                </div>
                            ))}
                        </td>
                        <td>
                            {formatCurrency(calculateOrderTotal(order.line_items))}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Layout>
    )
}