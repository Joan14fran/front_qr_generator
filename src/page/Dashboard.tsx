import { SidebarComp } from '../components/SidebarComp'
import { Avatar } from 'primereact/avatar';


export function Dashboard() {
  return (
    <div className='p-4'>
      <SidebarComp />
      <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
        <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
          <li>
            <a className="text-500 no-underline line-height-3 cursor-pointer">DashBoard</a>
          </li>
          <li className="px-2">
            <i className="pi pi-angle-right text-500 line-height-3"></i>
          </li>
          <li>
            <span className="text-900 line-height-3">Home</span>
          </li>
        </ul>
        <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
          <Avatar icon="pi pi-user" className="mr-2 py-5" size="xlarge" />
          <div>
            <div className="font-medium text-3xl text-900">Nombre Usuario</div>
            <div className="flex align-items-center text-700 flex-wrap">
              <div className="mr-5 flex items-center mt-3">
                <i className="pi pi-qrcode" style={{ color: 'slateblue' }}></i>
                <span className="ml-2">10 QRs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Dashboard