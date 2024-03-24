import { SidebarComp } from '../../components/SidebarComp';
import { Fieldset } from 'primereact/fieldset'
import { Card } from 'primereact/card'


export function Dashboard() {
  return (
    <div className="p-4">
      <SidebarComp />
      <br />
      <Fieldset>
        <Card title="Dash Board">

        </Card>
      </Fieldset>
    </div>
  );
}

export default Dashboard;
