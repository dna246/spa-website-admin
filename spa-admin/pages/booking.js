import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import {formatCurrency, formatDate} from "@/lib/utils";


export default function BookingPage(bookedServices) {
    const [bookings, setBookings] = useState([])

    useEffect (() => {
        axios.get('/api/booking').then(res => {
            setBookings(res.data)
        })
    }, [])

    const confirmBooking = async (bookingId) => {
        try {
            const response = await axios.post(`/api/bookings/${bookingId}/confirm`);
            console.log('Booking confirmed', response.data);
            // Update bookings state
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking._id === bookingId ? { ...booking, status: 'Xác nhận' } : booking
                )
            );
        } catch (error) {
            console.error("Failed to confirm booking:", error);
        }
    };


    const rejectBooking = async (bookingId) => {
        try {
            const response = await axios.post(`/api/bookings/${bookingId}/reject`);
            console.log('Booking rejected', response.data);
            // Update bookings state
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking._id === bookingId ? { ...booking, status: 'Huỷ bởi YLA' } : booking
                )
            );
        } catch (error) {
            console.error("Rejection failed:", error);
        }
    };

    const handleNoShow = async (bookingId) => {
        try {
            const response = await axios.post(`/api/bookings/${bookingId}/cancel`);
            setBookings(bookings.map(booking => {
                if (booking._id === bookingId) {
                    return { ...booking, isCompleted: false, status: 'Đã Huỷ' };
                }
                return booking;
            }));
            console.log('Canceled due to no show', response.data);
        } catch (error) {
            console.error("Failed to mark booking as no show:", error);
        }
    };

    const confirmBookingAsCompleted = async (bookingId) => {
        try {
            const response = await axios.post(`/api/bookings/${bookingId}/complete`);
            setBookings(bookings.map(booking => {
                if (booking._id === bookingId) {
                    return { ...booking, isCompleted: true, status: 'Đã Hoàn Thành' };
                }
                return booking;
            }));
            console.log('Booking completed', response.data);
        } catch (error) {
            console.error("Failed to mark booking as completed:", error);
        }
    };

    function calculateBookingTotal(bookedServices) {
        let total = 0;
        bookedServices?.forEach(service => {
            total += Number(service.unit_amount || 0);
        });
        return total;
    }

    return (
        <Layout>
            <h1>Quản lý Đặt hẹn</h1>
            <table className="basic">
                <thead>
                <tr>
                    <th>Ngày đặt</th>
                    <th>Người đặt</th>
                    <th>SĐT</th>
                    <th>Email</th>
                    <th>Dịch vụ</th>
                    <th>Thời gian hẹn</th>
                    <th>Xử lý</th>
                    <th>Thanh toán</th>
                </tr>
                </thead>
                <tbody>
                {bookings?.length > 0 && bookings.map(booking => (
                    <tr key={booking._id}>
                        <td>{formatDate(booking.createdAt)}</td>
                        <td>{booking.name}</td>
                        <td>{booking.phone}</td>
                        <td>{booking.email}</td>
                        <td>
                            {booking.bookedServices.map((service, index) => (
                                <small key={index}>
                                    {service.name} <br/>
                                </small>
                            ))}
                        </td>
                        <td>
                            {formatDate(booking.date, 'vn-VN', false)} <br/>
                            {booking.timeSlot}
                        </td>

                        <td>
                            {booking.status === 'Đang xử lý' ? (
                                <>
                                    <button onClick={() => confirmBooking(booking._id)} className="btn-primary mr-1">Xác nhận</button>
                                    <button onClick={() => rejectBooking(booking._id)} className="btn-primary">Huỷ</button>
                                </>
                            ) : (
                                <>
                                    {booking.status === 'Xác nhận' && (
                                        <span className="text-green-600">
                                            Đã xác nhận
                                        </span>
                                    )}
                                    {booking.status === 'Huỷ bởi YLA' && (
                                        <span className="text-red-600">
                                            Huỷ bởi Admin
                                        </span>
                                    )}
                                    {booking.status === 'Đã Huỷ' && (
                                        <span className="text-red-600">
                                            Khách Huỷ
                                        </span>
                                    )}
                                </>
                            )}
                        </td>
                        <td>
                            <div className="flex justify-between items-center">
                                {booking.status === 'Đang xử lý' ? (
                                    <em className="text-gray-500">Đợi xác nhận</em>
                                ) : booking.status === 'Xác nhận' ? (
                                    <>
                                        {!booking.isCompleted ? (
                                            <div className="flex justify-between items-center space-x-4">
                                                <div className="text-sm font-medium">
                                                    {formatCurrency(calculateBookingTotal(booking.bookedServices))}
                                                </div>
                                                <div className="flex flex-col space-y-2">
                                                    <button onClick={() => confirmBookingAsCompleted(booking._id)} className="btn-primary text-xs py-2 px-4 text-white rounded">
                                                        Đã Nhận
                                                    </button>
                                                    <button onClick={() => handleNoShow(booking._id)} className="btn-primary text-xs py-2 px-4 text-white rounded">
                                                        No Show
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-green-600">Done</span>
                                        )}
                                    </>
                                ) : null}
                            </div>
                        </td>

                    </tr>
                ))}
                    <tr>
                    </tr>
                </tbody>
            </table>
        </Layout>
    )
}