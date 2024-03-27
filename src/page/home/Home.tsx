// Home.tsx

//importaciones
import { Header } from '../../components/Header'
import { Fieldset } from 'primereact/fieldset'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'

export function Home() {

  return (

    <div className="container mt-5">
      <Header />
      <br />
      <Fieldset>
        <Card>
          
        </Card>
      </Fieldset>
    </div>


  );
}

export default Home;
