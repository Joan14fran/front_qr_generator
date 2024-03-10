import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';

import { logoutUser } from '../api/users.api';

export function SidebarComp() {

    const [visibleRight, setVisibleRight] = useState(false);
    const navigate = useNavigate(); // Utiliza useNavigate para redirigir al usuario

    const handleLogout = async () => {
        try {
            await logoutUser(); // Envía una solicitud al backend para cerrar sesión
            localStorage.removeItem('token'); // Elimina el token de autenticación del almacenamiento local
            navigate('/login', { replace: true }); // Redirige al usuario a la página de inicio de sesión y reemplaza la entrada actual en el historial
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };


    const items = [
        {
            label: 'DashBoard',
            icon: 'pi pi-home'
        },
        {
            label: 'Usuarios',
            icon: 'pi pi-users'
        },
        {
            label: 'Mi QRs',
            icon: 'pi pi-qrcode',
            items: [
                {
                    label: 'Crear QR',
                    icon: 'pi pi-plus',
                },
                {
                    label: 'Administrar QR',
                    icon: 'pi pi-chart-bar',
                },
            ]
        },
        {
            label: 'Sobre QRs',
            icon: 'pi pi-chevron-circle-right'
        }
    ];

    const end = (
        <div className="flex align-items-center gap-2">
            <Button icon="pi pi-align-justify" onClick={() => setVisibleRight(true)} rounded text severity="secondary" aria-label="justify" />
        </div>
    );

    return (
        <div className="p-4">
            <Menubar model={items} end={end} />

            <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
                <div className="p-sidebar-content" data-pc-section="content">
                    <div className="flex flex-col mx-auto md:mx-0">
                        <span className="mb-2 text-sm font-semibold text-gray-500">Welcome</span>
                        <span className="text-color-secondary font-medium mb-5 text-sm">Nombre Usuario</span>

                        <ul className="list-none m-0 p-0">
                            <li>
                                <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150 hover:border-primary">
                                    <span className="flex items-center">
                                        <i className="pi pi-user text-xl text-primary"></i>
                                    </span>
                                    <div className="ml-3">
                                        <span className="mb-2 font-semibold text-sm">Profile</span>
                                        <p className="text-color-secondary m-0 text-sm">Conoce y actualiza tu perfil</p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
                                    <span className="flex items-center">
                                        <i className="pi pi-cog text-xl text-blue-500"></i>
                                    </span>
                                    <div className="ml-3">
                                        <span className="mb-2 font-semibold text-sm">Settings</span>
                                        <p className="text-color-secondary m-0 text-sm">Configura tu aplicacion</p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150" onClick={handleLogout}>
                                    <span className="flex items-center">
                                        <i className="pi pi-power-off text-xl text-red-500"></i>
                                    </span>
                                    <div className="ml-3">
                                        <span className="mb-2 font-semibold text-sm">Sign Out</span>
                                        <p className="text-color-secondary m-0 text-sm">Salir de la sesion</p>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </Sidebar>
        </div>
    )
}

export default SidebarComp;
