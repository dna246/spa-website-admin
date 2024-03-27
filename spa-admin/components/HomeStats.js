import {formatCurrency} from "@/lib/utils";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import {subHours} from "date-fns";

export default function HomeStats() {
    const [orders, setOrders] = useState()
    const [bookings, setBookings] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [bookingLoaded, setBookingLoaded] = useState(false)
    useEffect(() => {
        setIsLoading(true)
        setBookingLoaded(true)
        axios.get('/api/orders').then(res => {
            setOrders(res.data)
            setIsLoading(false)
        })
        axios.get('/api/booking').then(res => {
            setBookings(res.data)
            console.log(res.data)
            setBookingLoaded(false)
        })
    }, [])

    function ordersTotal(orders) {
        let total = 0;
        orders?.forEach(order => {
            const {line_items} = order; //lay line_item from order
            line_items?.forEach(line => {
                const lineTotal = line.quantity * line.price_data.unit_amount;
                total += lineTotal
            })
        })
        return total;
    }

    function completedBookingsTotal(bookings) {
        let total = 0;
        bookings?.forEach(booking => {
            if (booking.isCompleted) {
                booking.bookedServices?.forEach(service => {
                    total += service.unit_amount;
                });
            }
        });
        return total;
    }


    if(isLoading) {
        return (
            <div className="my-4">
                <Spinner fullWidth={true}/>
            </div>

        )
    }

    const ordersToday = orders?.filter(o => new Date(o.createdAt) > subHours(new Date, 24))
    const ordersWeek = orders?.filter(o => new Date(o.createdAt) > subHours(new Date, 24*7))
    const ordersMonth = orders?.filter(o => new Date(o.createdAt) > subHours(new Date, 24*30))

    const completedToday = bookings?.filter(booking =>
        booking.isCompleted &&
        new Date(booking.createdAt) > subHours(new Date(), 24)
    );
    const completedWeek = bookings?.filter(booking =>
        booking.isCompleted &&
        new Date(booking.createdAt) > subHours(new Date(), 24 * 7)
    );
    const completedMonth = bookings?.filter(booking =>
        booking.isCompleted &&
        new Date(booking.createdAt) > subHours(new Date(), 24 * 30)
    );

    return (
        <div className="mt-3">
            <h2>Đơn Hàng</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="tile">
                    <h3 className="tile-header">Trong Ngày</h3>
                    <div className="tile-number">{formatCurrency(ordersTotal(ordersToday))}</div>
                    <div className="tile-desc">{ordersToday?.length} đơn hôm nay</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">Trong Tuần</h3>
                    <div className="tile-number">{formatCurrency(ordersTotal(ordersWeek))}</div>
                    <div className="tile-desc">{ordersWeek?.length} đơn tuần này</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">Trong Tháng</h3>
                    <div className="tile-number">{formatCurrency(ordersTotal(ordersMonth))}</div>
                    <div className="tile-desc">{ordersMonth?.length} đơn tháng này</div>
                </div>
            </div>

            <h2 className="mt-10">Lượt Serve qua Booking</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="tile">
                    <h3 className="tile-header">Trong Ngày</h3>
                    <div className="tile-number">{formatCurrency(completedBookingsTotal(completedToday))}</div>
                    <div className="tile-desc">{completedToday?.length} lượt hôm nay</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">Trong Tuần</h3>
                    <div className="tile-number">{formatCurrency(completedBookingsTotal(completedWeek))}</div>
                    <div className="tile-desc">{completedWeek?.length} lượt tuần này</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">Trong Tháng</h3>
                    <div className="tile-number">{formatCurrency(completedBookingsTotal(completedWeek))}</div>
                    <div className="tile-desc">{completedMonth?.length} lượt tháng này</div>
                </div>
            </div>

            <h2 className="mt-10">Lợi nhuận</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="tile">
                    <h3 className="tile-header">Trong Ngày</h3>
                    <div className="tile-number">{formatCurrency(ordersTotal(ordersToday) + completedBookingsTotal(completedToday))}</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">Trong Tuần</h3>
                    <div className="tile-number">{formatCurrency(ordersTotal(ordersWeek) + completedBookingsTotal(completedWeek))}</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">Trong Tháng</h3>
                    <div className="tile-number">{formatCurrency(ordersTotal(ordersMonth) + completedBookingsTotal(completedMonth))}</div>
                </div>
            </div>

        </div>
    )
}