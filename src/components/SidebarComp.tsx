import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

import { logoutUser } from '../api/users.api';

import '../assets/styles/layout.css'

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

    const handleNavigate = (path: string) => {
        // Utiliza la función navigate de react-router-dom para cambiar la ruta
        navigate(path);
    };


    const items = [
        {
            label: 'DashBoard',
            icon: 'pi pi-home',
            command: () => handleNavigate('/dashboard'),
        },
        {
            label: 'Usuarios',
            icon: 'pi pi-users',
            items: [
                {
                    label: 'Lista de Usuarios',
                    icon: 'pi pi-user',
                    command: () => handleNavigate('/usuarios'),
                },
            ]
        },
        {
            label: 'Mi QRs',
            icon: 'pi pi-qrcode',
            items: [
                {
                    label: 'Crear QR',
                    icon: 'pi pi-plus',
                    command: () => handleNavigate('/create_qrs'),
                },
                {
                    label: 'Administrar QR',
                    icon: 'pi pi-chart-bar',
                    command: () => handleNavigate('/qrs'),
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

            <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)} className="layout-profile-sidebar bg-dark text-light">
                <div className="d-flex flex-column mx-auto md:mx-0">
                    <span className="mb-2 font-weight-bold">Bienvenido</span>
                    <span className="text-muted font-medium mb-5">Johan Peña</span>

                    <ul className="list-unstyled m-0 p-0">
                        <li>
                            <Link to="/perfil" className="cursor-pointer d-flex border mb-3 p-3 align-items-center border-4 border-secondary border-dark rounded transition-duration-150">
                                <span className="icon-container">
                                    <i className="pi pi-user text-xl" style={{ color: 'slateblue' }}></i>
                                </span>
                                <div className="ml-3">
                                    <span className="mb-2 font-weight-bold">Perfil</span>
                                    <p className="text-muted m-0">Usuario</p>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <a href="#" className="d-flex border mb-3 p-3 align-items-center border-1 border-dark rounded transition-duration-150">
                                <span className="icon-container">
                                    <i className="pi pi-id-card text-xl" style={{ color: 'slateblue' }}></i>
                                </span>
                                <div className="ml-3">
                                    <span className="mb-2 font-weight-bold">johan@gmail.com</span>
                                    <p className="text-muted m-0">300 223 2968</p>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="cursor-pointer d-flex border mb-3 p-3 align-items-center border-1 border-dark rounded transition-duration-150" onClick={handleLogout}>
                                <span className="icon-container">
                                    <i className="pi pi-power-off text-xl text-danger" style={{ color: '' }}></i>
                                </span>
                                <div className="ml-3">
                                    <span className="mb-2 font-weight-bold">Cerrar sesión</span>
                                    <p className="text-muted m-0"></p>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </Sidebar>
        </div>

    )
}

export default SidebarComp;
