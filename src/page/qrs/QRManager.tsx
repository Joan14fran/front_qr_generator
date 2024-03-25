import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { CreateQrsUrl } from '../../components/CreateQrUrl'; // Componente para crear QRs de tipo URL
import { CreateQRText } from '../../components/CreateQRText'
import { CreateQRMail } from '../../components/CreateQRMail'
import { CreateQRCard } from '../../components/CreateQRCard'
import { SidebarComp } from '../../components/SidebarComp'


export function QRManager() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="p-4">
            <SidebarComp />
            <br />
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="URL QR" leftIcon="pi pi-link m-2">
                    <CreateQrsUrl />
                </TabPanel>
                <TabPanel header="Texto QR" leftIcon="pi pi-align-center m-2">
                    <CreateQRText />
                </TabPanel>
                <TabPanel header="Email QR" leftIcon="pi pi-at m-2">
                    <CreateQRMail />
                </TabPanel>
                <TabPanel header="Tarjeta de Presentación QR" leftIcon="pi pi-id-card m-2">
                    <CreateQRCard />
                </TabPanel>
                <TabPanel header="PDF QR" leftIcon="pi pi-file-pdf m-2" disabled></TabPanel>
            </TabView>
        </div>
    );
}
