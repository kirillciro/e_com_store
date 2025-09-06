import { BarChart, PlusCircle, ShoppingBasket, ClipboardList, Percent } from 'lucide-react'
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CreateProductForm from '../components/CreateProductForm';
import ProductsList from '../components/ProductsList';
import AnalyticsTab from '../components/AnalyticsTab';
import { useProductStore } from '../stores/useProductStore';
import { useOrderStore } from '../stores/useOrderStore';
import OrdersTab from '../components/OrdersTab';
import CouponsTab from '../components/CouponsTab';





const tabs = [{
        id: "create",
        label: "Create Product",
        icon: PlusCircle
}, {
        id: "products",
        label: " Products",
        icon: ShoppingBasket},
        {
        id: "orders",
        label: "Orders",
        icon: ClipboardList,
},
        {
        id: "coupons",
        label: "Coupons",
        icon: Percent,
},
{
        id: "analytics",
        label: "Analytics",
        icon: BarChart,
}]

const AdminPage = () => {
        const [activeTab, setActiveTab] = useState("create")
        const { fetchAllProducts } = useProductStore();


        return (
                <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
                        <div className='relative z-10 container mx-auto px-4 py-16'>
                                <motion.h1
                                          className='text-4xl font-bold  my-10 text-blue-400 text-center'
                                          initial={{ opacity: 0, y: -20}}
                                          animate={{opacity: 1, y: 0}}
                                          transition={{duration: 0.8}}
                                >
                                        Admin Dashboard
                                        </motion.h1>               

                                                        <div className='flex justify-center gap-2 mb-8'>
                                                                {
                                                                        tabs.map((tab) => (
                                                                                <button
                                                                        key={tab.id}
                                                                        onClick={() => setActiveTab(tab.id)}
                                                                        className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                                                                                activeTab === tab.id
                                                                        ? "bg-blue-600 text-white"
                                                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                                        }`}
                                                                        >
                                                                                <tab.icon className='mr-2 h-5 w-5' />
                                                                                {tab.label
                                                                                }
                                                                        </button>
                                                                        ))
                                                                }
                                                        </div>
                                                        {activeTab === "create" && <CreateProductForm />}
                                                        {activeTab === "products" && <ProductsList />}
                                                        {activeTab === "analytics" && <AnalyticsTab />}
                                                        {activeTab === "orders" && <OrdersTab />}
                                                        {activeTab === "coupons" && <CouponsTab />}
                        </div>
                </div>
        )
}

export default AdminPage;