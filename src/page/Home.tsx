// Home.tsx

//importaciones
import { ProgressSpinner } from 'primereact/progressspinner';

export function Home() {

  return (
    <div className="card">
      <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".9s" />
    </div>


  );
}

export default Home;
