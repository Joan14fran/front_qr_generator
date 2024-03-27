import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { ListQRUrl } from '../../components/ListQRUrl';
import { ListQRText } from '../../components/ListQRText'
import { ListQRMail } from '../../components/ListQRMail'
import { ListQRCard } from '../../components/ListQRCard'
import { SidebarComp } from '../../components/SidebarComp'


export function ListManagerQRs() {

    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="p-4">
            <SidebarComp />
            <br />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="URL QR" leftIcon="pi pi-link m-2">
                    <ListQRUrl />
                </TabPanel>
                <TabPanel header="Texto QR" leftIcon="pi pi-align-center m-2">
                    <ListQRText />
                </TabPanel>
                <TabPanel header="Email QR" leftIcon="pi pi-at m-2">
                    <ListQRMail />
                </TabPanel>
                <TabPanel header="Tarjeta de Presentación QR" leftIcon="pi pi-id-card m-2">
                    <ListQRCard />
                </TabPanel>
                <TabPanel header="PDF QR" leftIcon="pi pi-file-pdf m-2" disabled></TabPanel>
            </TabView>
        </div>
    )
}
