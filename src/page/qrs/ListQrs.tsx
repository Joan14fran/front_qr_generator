import { SidebarComp } from '../../components/SidebarComp'
import { Fieldset } from 'primereact/fieldset'
import { Card } from 'primereact/card'

export function ListQrs() {
  return (
    <div className='p-4'>
      <SidebarComp />
      <br />
      <Fieldset>
        <Card title="Administrar QRs">

        </Card>
      </Fieldset>
    </div>
  )
}

export default ListQrs