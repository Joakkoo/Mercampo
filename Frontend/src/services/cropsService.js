const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getCrops() {
  const res = await fetch(`${API_URL}/crops`);
  if (!res.ok) throw new Error('Error al cargar cultivos');
  return res.json();
}
