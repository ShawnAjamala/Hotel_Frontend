import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, PartyPopper, X, ImagePlus, Users, Grid3X3, List, Package, PlusCircle, MinusCircle } from 'lucide-react';
import API from '../services/api';
import StaffNavbar from '../components/StaffNavbar';
import Footer from '../components/Footer';

const StaffVenues = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const [form, setForm] = useState({ 
    name: '', 
    venue_type: 'wedding', 
    capacity: '', 
    price_per_day: '', 
    description: '', 
    additional_packages: '' 
  });
  const [packageItems, setPackageItems] = useState([]);
  const [packageName, setPackageName] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchVenues(); }, []);

  const fetchVenues = async () => { 
    setLoading(true); 
    try { 
      const res = await API.get('/venues/', { headers }); 
      setVenues(Array.isArray(res.data) ? res.data : []); 
    } catch (err) {} 
    setLoading(false); 
  };

  const handleImageChange = (e) => { 
    const file = e.target.files[0]; 
    if (file) { 
      setImage(file); 
      setImagePreview(URL.createObjectURL(file)); 
    } 
  };

  const addPackage = () => {
    if (packageName.trim() && packagePrice) {
      setPackageItems([...packageItems, { name: packageName.trim(), price: parseFloat(packagePrice) }]);
      setPackageName('');
      setPackagePrice('');
    }
  };

  const removePackage = (index) => {
    setPackageItems(packageItems.filter((_, i) => i !== index));
  };

  const updatePackagesString = () => {
    return packageItems.map(p => `${p.name}: ${p.price}`).join(', ');
  };

  const handleCreate = async (e) => { 
    e.preventDefault(); 
    const fd = new FormData(); 
    const packageString = updatePackagesString();
    Object.entries(form).forEach(([k,v]) => {
      if (k === 'additional_packages') {
        fd.append(k, packageString);
      } else {
        fd.append(k, v);
      }
    });
    if(image) fd.append('image',image); 
    try { 
      await API.post('/venues/create/', fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }); 
      resetForm(); 
      fetchVenues(); 
    } catch (err) {} 
  };

  const handleUpdate = async (e) => { 
    e.preventDefault(); 
    const fd = new FormData(); 
    const packageString = updatePackagesString();
    Object.entries(form).forEach(([k,v]) => {
      if (k === 'additional_packages') {
        fd.append(k, packageString);
      } else {
        fd.append(k, v);
      }
    });
    if(image) fd.append('image',image); 
    try { 
      await API.put(`/venues/${editingVenue.id}/update/`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }); 
      resetForm(); 
      fetchVenues(); 
    } catch (err) {} 
  };

  const handleDelete = async (id) => { 
    if (!window.confirm('Deactivate this venue?')) return; 
    try { 
      await API.delete(`/venues/${id}/delete/`, { headers }); 
      fetchVenues(); 
    } catch (err) {} 
  };

  const openEdit = (v) => { 
    setEditingVenue(v); 
    setForm({ 
      name: v.name, 
      venue_type: v.venue_type, 
      capacity: v.capacity, 
      price_per_day: parseFloat(v.price_per_day)||'', 
      description: v.description||'', 
      additional_packages: v.additional_packages||'' 
    });
    // Parse existing packages
    if (v.additional_packages) {
      const items = v.additional_packages.split(',').map(p => p.trim()).filter(p => p.includes(':'));
      const parsed = items.map(p => {
        const [name, price] = p.split(':');
        return { name: name.trim(), price: parseFloat(price.trim()) || 0 };
      });
      setPackageItems(parsed);
    } else {
      setPackageItems([]);
    }
    setImagePreview(v.image||null); 
    setImage(null); 
    setShowForm(true); 
  };

  const resetForm = () => { 
    setForm({ name:'', venue_type:'wedding', capacity:'', price_per_day:'', description:'', additional_packages:'' }); 
    setPackageItems([]);
    setPackageName('');
    setPackagePrice('');
    setImage(null); 
    setImagePreview(null); 
    setEditingVenue(null); 
    setShowForm(false); 
  };

  const totalPages = Math.ceil(venues.length / perPage);
  const paginatedVenues = venues.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <StaffNavbar />
      <section className="bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div><div className="flex items-center gap-2 mb-2"><PartyPopper className="w-5 h-5 text-amber-300" /><span className="text-amber-200 text-sm uppercase">Staff Management</span></div><h1 className="text-4xl font-bold">Event Venues</h1><p className="text-amber-100/80 mt-2">{venues.length} venue{venues.length!==1?'s':''}</p></div>
            <div className="flex items-center gap-3">
              <div className="flex bg-white/10 rounded-lg p-1"><button onClick={()=>setViewMode('grid')} className={`p-2 rounded-md transition ${viewMode==='grid'?'bg-white text-amber-900':'text-white/70 hover:text-white'}`}><Grid3X3 className="w-5 h-5" /></button><button onClick={()=>setViewMode('list')} className={`p-2 rounded-md transition ${viewMode==='list'?'bg-white text-amber-900':'text-white/70 hover:text-white'}`}><List className="w-5 h-5" /></button></div>
              <button onClick={()=>{resetForm();setShowForm(!showForm)}} className="bg-white text-amber-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 flex items-center gap-2 shadow-lg"><Plus className="w-5 h-5" /> {showForm?'Close':'Add Venue'}</button>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-8 -mt-6 z-10 pb-16">
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl border overflow-hidden mb-10">
            <div className="bg-stone-50 px-8 py-5 border-b flex justify-between"><div className="flex items-center gap-3"><div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center"><PartyPopper className="w-5 h-5 text-amber-700" /></div><h2 className="text-lg font-bold">{editingVenue?'Edit Venue':'Create Venue'}</h2></div><button onClick={resetForm} className="text-stone-400 hover:text-red-500"><X className="w-5 h-5" /></button></div>
            <form onSubmit={editingVenue?handleUpdate:handleCreate} className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Venue Name *</label>
                    <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="Grand Ballroom" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Venue Type *</label>
                    <select value={form.venue_type} onChange={e=>setForm({...form,venue_type:e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                      <option value="wedding">Wedding</option>
                      <option value="birthday">Birthday</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Capacity *</label>
                    <input type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="200" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Price/Day (KES) *</label>
                    <input type="number" value={form.price_per_day} onChange={e=>setForm({...form,price_per_day:e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="50000" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                    <input type="text" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="Elegant ballroom with chandeliers" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Image</label>
                  <div className="border-2 border-dashed rounded-2xl p-4 text-center hover:border-amber-400 cursor-pointer h-[180px] flex flex-col items-center justify-center bg-stone-50" onClick={()=>document.getElementById('vimg').click()}>
                    {imagePreview?<img src={imagePreview} className="h-full object-cover rounded-xl" />:<><ImagePlus className="w-10 h-10 text-stone-300 mb-2" /><p className="text-stone-500 text-sm">Upload Image</p></>}
                    <input id="vimg" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </div>
                </div>
              </div>

              {/* Packages Section */}
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-stone-800">Additional Packages</h3>
                  <span className="text-xs text-stone-400 ml-2">(Guests can select these during booking)</span>
                </div>
                
                <div className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="Package name (e.g. Decor, Catering)"
                    className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                  <input
                    type="number"
                    value={packagePrice}
                    onChange={(e) => setPackagePrice(e.target.value)}
                    placeholder="Price"
                    className="w-28 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addPackage}
                    className="px-4 py-2 bg-amber-700 text-white rounded-xl hover:bg-amber-800 transition flex items-center gap-1 text-sm"
                  >
                    <PlusCircle className="w-4 h-4" /> Add
                  </button>
                </div>

                {packageItems.length > 0 && (
                  <div className="bg-stone-50 rounded-xl p-3 space-y-2 max-h-[120px] overflow-y-auto">
                    {packageItems.map((pkg, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 border border-stone-200">
                        <span className="font-medium text-stone-700">{pkg.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-emerald-600 font-bold">KES {pkg.price.toLocaleString()}</span>
                          <button
                            type="button"
                            onClick={() => removePackage(index)}
                            className="text-red-400 hover:text-red-600 transition"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {packageItems.length === 0 && (
                  <p className="text-sm text-stone-400 italic">No packages added yet. Add services guests can select.</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t flex gap-4">
                <button type="submit" className="bg-amber-700 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-amber-600 shadow-lg transition">{editingVenue?'Update Venue':'Create Venue'}</button>
                <button type="button" onClick={resetForm} className="text-stone-500 hover:text-stone-700 transition">Cancel</button>
              </div>
            </form>
          </div>
        )}
        {/* Rest of the component remains the same */}
        {loading?<div className="text-center py-20"><div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto" /></div>:venues.length===0?(
          <div className="text-center py-20 bg-white rounded-2xl border"><PartyPopper className="w-16 h-16 text-stone-200 mx-auto mb-4" /><h3 className="text-xl font-semibold text-stone-600">No Venues</h3><button onClick={()=>setShowForm(true)} className="bg-amber-700 text-white px-6 py-3 rounded-xl mt-4">Create First Venue</button></div>
        ):(
          <>
            {viewMode==='grid'?(
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedVenues.map(v=>(<div key={v.id} className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition group"><div className="h-48 bg-stone-100 relative">{v.image?<img src={v.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />:<div className="w-full h-full flex items-center justify-center"><PartyPopper className="w-12 h-12 text-stone-300" /></div>}<div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-sm font-bold">{v.name}</div><div className="absolute top-3 right-3 bg-amber-700 text-white px-3 py-1 rounded-full text-xs capitalize">{v.venue_type}</div></div><div className="p-5"><div className="flex justify-between mb-2"><h3 className="font-bold">{v.name}</h3><span className="text-emerald-600 font-bold">KES {parseFloat(v.price_per_day).toLocaleString()}<span className="text-stone-400 text-xs">/day</span></span></div><div className="flex items-center gap-1 text-stone-400 text-xs mb-3"><Users className="w-3 h-3" /> {v.capacity} guests</div><div className="flex gap-3 pt-4 border-t"><button onClick={()=>openEdit(v)} className="flex-1 flex items-center justify-center gap-2 text-sm bg-amber-50 text-amber-700 py-2.5 rounded-xl hover:bg-amber-100"><Edit className="w-4 h-4" /> Edit</button><button onClick={()=>handleDelete(v.id)} className="flex-1 flex items-center justify-center gap-2 text-sm bg-red-50 text-red-500 py-2.5 rounded-xl hover:bg-red-100"><Trash2 className="w-4 h-4" /> Delete</button></div></div></div>))}
              </div>
            ):(
              <div className="space-y-3">
                {paginatedVenues.map(v=>(<div key={v.id} className="bg-white rounded-2xl border p-5 flex items-center justify-between hover:shadow-md transition"><div className="flex items-center gap-4"><div className="w-16 h-16 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0">{v.image?<img src={v.image} className="w-full h-full object-cover" />:<div className="w-full h-full flex items-center justify-center"><PartyPopper className="w-8 h-8 text-stone-300" /></div>}</div><div><h3 className="font-bold text-stone-800">{v.name} <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full capitalize ml-2">{v.venue_type}</span></h3><p className="text-stone-500 text-sm">{v.description||'No description'} • {v.capacity} guests</p></div></div><div className="flex items-center gap-6"><span className="font-bold text-stone-800">KES {parseFloat(v.price_per_day).toLocaleString()}<span className="text-stone-400 text-xs font-normal">/day</span></span><div className="flex gap-2"><button onClick={()=>openEdit(v)} className="px-4 py-2 text-sm bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100"><Edit className="w-4 h-4 inline mr-1" /> Edit</button><button onClick={()=>handleDelete(v.id)} className="px-4 py-2 text-sm bg-red-50 text-red-500 rounded-xl hover:bg-red-100"><Trash2 className="w-4 h-4 inline mr-1" /> Delete</button></div></div></div>))}
              </div>
            )}
            {totalPages>1&&(<div className="flex justify-center items-center gap-3 mt-10"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm hover:border-amber-400 disabled:opacity-40">← Prev</button>{Array.from({length:totalPages},(_,i)=>i+1).map(p=>(<button key={p} onClick={()=>setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-medium transition ${page===p?'bg-amber-700 text-white':'bg-white border border-stone-200 text-stone-600 hover:border-amber-400'}`}>{p}</button>))}<button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm hover:border-amber-400 disabled:opacity-40">Next →</button></div>)}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default StaffVenues;