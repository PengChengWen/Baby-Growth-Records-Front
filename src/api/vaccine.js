const API_BASE = import.meta.env.VITE_API_BASE_URL

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

export async function fetchVaccineRecords() {
  const res = await fetch(`${API_BASE}/vaccine-records`, {
    headers: defaultHeaders,
  })
  const data = await res.json()
  if (data.code !== 0) throw new Error('获取数据失败')
  return data.data
}

export async function updateVaccineRecord(id, fields) {
  const res = await fetch(`${API_BASE}/vaccine-records/${id}`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify(fields)
  })
  const data = await res.json()
  if (data.code !== 0) throw new Error(data.message || '更新失败')
  return data.data
}
