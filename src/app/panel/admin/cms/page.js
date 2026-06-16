'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Type, Save, Plus, Trash2, Home, Info, HelpCircle, Building, Image as ImageIcon, Phone, MessageSquare, ChevronDown, ChevronUp, LayoutGrid, X, Settings, GripVertical } from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

export default function CMSDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isSaving, setIsSaving] = useState(false);

  // State to hold all CMS data
  const [cmsData, setCmsData] = useState({
    home: { 
      heroTitle: '', heroSubtitle: '', statsHappyFamilies: '', statsYearsExperience: '', statsProjectsDelivered: '',
      advantageTitle: '', advantageSubtitle: '', advantages: [],
      amenitiesTitle: '', amenitiesSubtitle: '', amenities: [],
      ctaTitle: '', ctaSubtitle: ''
    },
    about: { heroTitle: '', heroSubtitle: '', heroImage: '', journeySubtitle: '', journeyTitle: '', journeyImage: '', story: '', missionTitle: '', mission: '', visionTitle: '', vision: '', team: [], leadershipSubtitle: '', leadershipTitle: '' },
    propertiesSale: { title: '', subtitle: '' },
    propertiesRent: { title: '', subtitle: '' },
    gallery: { title: '', subtitle: '', images: [] },
    contact: { title: '', subtitle: '', officeHours: '', address: '', phones: [], emails: [] },
    faqs: [],
    testimonials: []
  });

  const [visibleBlocks, setVisibleBlocks] = useState({
    hero: true, stats: true, advantages: true, amenities: true, cta: true,
    aboutHero: true, story: true, aboutTeam: true,
    contact: true, contactInfo: true,
    faqs: true, testimonials: true, propertiesSale: true, propertiesRent: true,
    gallery: true, galleryImages: true
  });

  async function fetchCmsData() {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cms`);
      if (res.data) {
        setCmsData(res.data);
        const d = res.data;
        setVisibleBlocks({
          hero: !!(d.home?.heroTitle || d.home?.heroSubtitle),
          stats: !!(d.home?.statsHappyFamilies || d.home?.statsYearsExperience || d.home?.statsProjectsDelivered),
          advantages: !!(d.home?.advantageTitle || d.home?.advantageSubtitle || d.home?.advantages?.length),
          amenities: !!(d.home?.amenitiesTitle || d.home?.amenitiesSubtitle || d.home?.amenities?.length),
          cta: !!(d.home?.ctaTitle || d.home?.ctaSubtitle),
          aboutHero: !!(d.about?.heroTitle || d.about?.heroSubtitle),
          story: !!(d.about?.story || d.about?.mission || d.about?.vision || d.about?.journeyTitle),
          aboutTeam: !!(d.about?.team?.length),
          contact: !!(d.contact?.title || d.contact?.subtitle || d.contact?.officeHours),
          contactInfo: !!(d.contact?.address || d.contact?.phones?.length || d.contact?.emails?.length),
          faqs: !!(d.faqs?.length),
          testimonials: !!(d.testimonials?.length),
          propertiesSale: !!(d.propertiesSale?.title || d.propertiesSale?.subtitle),
          propertiesRent: !!(d.propertiesRent?.title || d.propertiesRent?.subtitle),
          gallery: !!(d.gallery?.title || d.gallery?.subtitle),
          galleryImages: !!(d.gallery?.images?.length)
        });
      }
    } catch (error) {
      console.error('Error fetching CMS data', error);
      toast.error('Failed to load CMS data');
    } finally {
      setTimeout(() => setLoading(false), 0);
    }
  }


  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      router.push('/panel/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCmsData();
  }, [router]);

  // Auto-save debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token');
      if (token && cmsData && Object.keys(cmsData.home).length > 0) {
        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/cms`, cmsData, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(err => console.error('Auto-save error:', err));
      }
    }, 1500); // 1.5 second debounce

    return () => clearTimeout(timer);
  }, [cmsData]);



  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/cms`, cmsData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('CMS content updated successfully!');
    } catch (error) {
      console.error('Error saving CMS data', error);
      toast.error('Failed to save CMS data. Check your connection or login.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (section, field, value) => {
    setCmsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addFaq = () => setCmsData(prev => ({ ...prev, faqs: [...(prev.faqs||[]), { question: '', answer: '' }] }));
  const removeFaq = (index) => setConfirmDialog({
    isOpen: true, title: 'Delete FAQ', message: 'Are you sure you want to delete this FAQ?',
    onConfirm: () => { setCmsData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) })); setConfirmDialog({ isOpen: false, onConfirm: null }); }
  });
  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...(cmsData.faqs||[])];
    newFaqs[index][field] = value;
    setCmsData(prev => ({ ...prev, faqs: newFaqs }));
  };

  const addAdvantage = () => setCmsData(prev => ({ ...prev, home: { ...prev.home, advantages: [...(prev.home.advantages||[]), { icon: 'ShieldCheck', title: '', desc: '' }] } }));
  const removeAdvantage = (index) => setConfirmDialog({
    isOpen: true, title: 'Delete Advantage', message: 'Are you sure you want to delete this advantage item?',
    onConfirm: () => { setCmsData(prev => ({ ...prev, home: { ...prev.home, advantages: prev.home.advantages.filter((_, i) => i !== index) } })); setConfirmDialog({ isOpen: false, onConfirm: null }); }
  });
  const handleAdvantageChange = (index, field, value) => {
    const newArr = [...(cmsData.home.advantages||[])];
    newArr[index][field] = value;
    setCmsData(prev => ({ ...prev, home: { ...prev.home, advantages: newArr } }));
  };

  const addAmenity = () => setCmsData(prev => ({ ...prev, home: { ...prev.home, amenities: [...(prev.home.amenities||[]), { icon: 'Dumbbell', text: '' }] } }));
  const removeAmenity = (index) => setConfirmDialog({
    isOpen: true, title: 'Delete Amenity', message: 'Are you sure you want to delete this amenity?',
    onConfirm: () => { setCmsData(prev => ({ ...prev, home: { ...prev.home, amenities: prev.home.amenities.filter((_, i) => i !== index) } })); setConfirmDialog({ isOpen: false, onConfirm: null }); }
  });
  const handleAmenityChange = (index, field, value) => {
    const newArr = [...(cmsData.home.amenities||[])];
    newArr[index][field] = value;
    setCmsData(prev => ({ ...prev, home: { ...prev.home, amenities: newArr } }));
  };

  const addTestimonial = () => setCmsData(prev => ({ ...prev, testimonials: [...(prev.testimonials||[]), { name: '', review: '', role: 'Happy Homeowner' }] }));
  const removeTestimonial = (index) => setConfirmDialog({
    isOpen: true, title: 'Delete Testimonial', message: 'Are you sure you want to delete this testimonial?',
    onConfirm: () => { setCmsData(prev => ({ ...prev, testimonials: prev.testimonials.filter((_, i) => i !== index) })); setConfirmDialog({ isOpen: false, onConfirm: null }); }
  });
  const handleTestimonialChange = (index, field, value) => {
    const newArr = [...(cmsData.testimonials||[])];
    newArr[index][field] = value;
    setCmsData(prev => ({ ...prev, testimonials: newArr }));
  };

  const addTeamMember = () => setCmsData(prev => ({ ...prev, about: { ...prev.about, team: [...(prev.about.team||[]), { name: '', role: '', img: '' }] } }));
  const removeTeamMember = (index) => setConfirmDialog({
    isOpen: true, title: 'Delete Team Member', message: 'Are you sure you want to delete this team member?',
    onConfirm: () => { setCmsData(prev => ({ ...prev, about: { ...prev.about, team: prev.about.team.filter((_, i) => i !== index) } })); setConfirmDialog({ isOpen: false, onConfirm: null }); }
  });
  const handleTeamMemberChange = (index, field, value) => {
    const newArr = [...(cmsData.about.team||[])];
    newArr[index][field] = value;
    setCmsData(prev => ({ ...prev, about: { ...prev.about, team: newArr } }));
  };

  const addGalleryImage = () => setCmsData(prev => ({ ...prev, gallery: { ...prev.gallery, images: [...(prev.gallery.images||[]), { url: '', project: '', category: '' }] } }));
  const removeGalleryImage = (index) => setConfirmDialog({
    isOpen: true, title: 'Delete Gallery Image', message: 'Are you sure you want to delete this image?',
    onConfirm: () => { setCmsData(prev => ({ ...prev, gallery: { ...prev.gallery, images: prev.gallery.images.filter((_, i) => i !== index) } })); setConfirmDialog({ isOpen: false, onConfirm: null }); }
  });
  const handleGalleryImageChange = (index, field, value) => {
    const newArr = [...(cmsData.gallery.images||[])];
    newArr[index][field] = value;
    setCmsData(prev => ({ ...prev, gallery: { ...prev.gallery, images: newArr } }));
  };

  const addPhone = () => setCmsData(prev => ({ ...prev, contact: { ...prev.contact, phones: [...(prev.contact.phones||[]), ''] } }));
  const removePhone = (index) => setConfirmDialog({
    isOpen: true, title: 'Delete Phone Number', message: 'Are you sure you want to delete this phone number?',
    onConfirm: () => { setCmsData(prev => ({ ...prev, contact: { ...prev.contact, phones: prev.contact.phones.filter((_, i) => i !== index) } })); setConfirmDialog({ isOpen: false, onConfirm: null }); }
  });
  const handlePhoneChange = (index, value) => {
    const newArr = [...(cmsData.contact.phones||[])];
    newArr[index] = value;
    setCmsData(prev => ({ ...prev, contact: { ...prev.contact, phones: newArr } }));
  };

  const addEmail = () => setCmsData(prev => ({ ...prev, contact: { ...prev.contact, emails: [...(prev.contact.emails||[]), ''] } }));
  const removeEmail = (index) => setConfirmDialog({
    isOpen: true, title: 'Delete Email', message: 'Are you sure you want to delete this email?',
    onConfirm: () => { setCmsData(prev => ({ ...prev, contact: { ...prev.contact, emails: prev.contact.emails.filter((_, i) => i !== index) } })); setConfirmDialog({ isOpen: false, onConfirm: null }); }
  });
  const handleEmailChange = (index, value) => {
    const newArr = [...(cmsData.contact.emails||[])];
    newArr[index] = value;
    setCmsData(prev => ({ ...prev, contact: { ...prev.contact, emails: newArr } }));
  };

  const [showModal, setShowModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [expanded, setExpanded] = useState({ 
    hero: true, stats: false, advantages: false, amenities: false, cta: false,
    story: true, contact: true, faqs: true, testimonials: true, gallery: true, sale: true, rent: true
  });

  const toggleSection = (sec) => setExpanded(prev => ({ ...prev, [sec]: !prev[sec] }));

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-navy font-bold">Loading...</div>;

  const handleDeleteSection = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Section',
      message: 'Are you sure you want to delete this section?',
      onConfirm: () => {
        const newData = { ...cmsData };
        if (id === 'hero') { newData.home.heroTitle = ''; newData.home.heroSubtitle = ''; }
        else if (id === 'stats') { newData.home.statsHappyFamilies = ''; newData.home.statsYearsExperience = ''; newData.home.statsProjectsDelivered = ''; }
        else if (id === 'advantages') { newData.home.advantageTitle = ''; newData.home.advantageSubtitle = ''; newData.home.advantages = []; }
        else if (id === 'amenities') { newData.home.amenitiesTitle = ''; newData.home.amenitiesSubtitle = ''; newData.home.amenities = []; }
        else if (id === 'cta') { newData.home.ctaTitle = ''; newData.home.ctaSubtitle = ''; }
        else if (id === 'story') { newData.about.story = ''; newData.about.mission = ''; newData.about.vision = ''; newData.about.journeyTitle = ''; }
        else if (id === 'aboutHero') { newData.about.heroTitle = ''; newData.about.heroSubtitle = ''; }
        else if (id === 'aboutTeam') { newData.about.team = []; }
        else if (id === 'contact') { newData.contact.title = ''; newData.contact.subtitle = ''; newData.contact.officeHours = ''; }
        else if (id === 'contactInfo') { newData.contact.address = ''; newData.contact.phones = []; newData.contact.emails = []; }
        else if (id === 'testimonials') { newData.testimonials = []; }
        else if (id === 'faqs') { newData.faqs = []; }
        else if (['propertiesSale', 'propertiesRent', 'gallery'].includes(id)) { newData[id].title = ''; newData[id].subtitle = ''; }
        else if (id === 'galleryImages') { newData.gallery.images = []; }
        
        setCmsData(newData);
        setVisibleBlocks(prev => ({ ...prev, [id]: false }));
        toast.success('Section deleted! Click Save Changes to remove from website.');
        setConfirmDialog({ isOpen: false, onConfirm: null });
      }
    });
  };

  const renderAccordionHeader = (id, title) => (
    <div 
      className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => toggleSection(id)}
    >
      <div className="flex items-center text-navy font-bold">
        <GripVertical size={18} className="text-gray-400 mr-3 cursor-grab" />
        <LayoutGrid size={18} className="text-gold mr-3" />
        {title}
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            handleDeleteSection(id);
          }} 
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Delete Section"
        >
          <Trash2 size={18} />
        </button>
        <button className="text-gray-500 hover:text-navy">
          {expanded[id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-gray-100 bg-white">
          <div>
            <h1 className="text-2xl font-black text-navy">Website Editor</h1>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center text-navy bg-white border-2 border-navy hover:bg-gray-50 font-bold px-6 py-2.5 rounded-xl shadow-sm transition-colors text-sm"
            >
              <Plus size={18} className="mr-2" /> Add New Section
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-colors text-sm ${isSaving ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}
            >
              <Save size={18} className="mr-2" /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Horizontal Tabs */}
        <div className="px-6 pt-4 border-b border-gray-100 overflow-x-auto bg-white">
          <div className="flex space-x-2 pb-2">
            {[
              { id: 'home', label: 'Homepage' },
              { id: 'about', label: 'About' },
              { id: 'contact', label: 'Contact' },
              { id: 'propertiesSale', label: 'Sale' },
              { id: 'propertiesRent', label: 'Rent' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'faq', label: 'FAQs' },
              { id: 'testimonials', label: 'Testimonials' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-navy text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Blocks Container */}
        <div className="p-6 bg-gray-50 min-h-[500px]">
          
          {/* HOME PAGE BLOCKS */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              
              {/* HERO BLOCK */}
              {visibleBlocks.hero && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader('hero', 'Hero Banner Section')}
                {expanded.hero && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                      <input type="text" value={cmsData.home.heroTitle} onChange={(e) => handleChange('home', 'heroTitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-navy focus:ring-1 focus:ring-navy text-sm font-semibold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Subtitle</label>
                      <textarea rows="2" value={cmsData.home.heroSubtitle} onChange={(e) => handleChange('home', 'heroSubtitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-navy focus:ring-1 focus:ring-navy text-sm resize-none" />
                    </div>
                  </div>
                )}
              </div>
              )}

              {/* STATS BLOCK */}
              {visibleBlocks.stats && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader('stats', 'Statistics Block')}
                {expanded.stats && (
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Happy Families</label>
                      <input type="text" value={cmsData.home.statsHappyFamilies} onChange={(e) => handleChange('home', 'statsHappyFamilies', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Years Experience</label>
                      <input type="text" value={cmsData.home.statsYearsExperience} onChange={(e) => handleChange('home', 'statsYearsExperience', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Projects Delivered</label>
                      <input type="text" value={cmsData.home.statsProjectsDelivered} onChange={(e) => handleChange('home', 'statsProjectsDelivered', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" />
                    </div>
                  </div>
                )}
              </div>
              )}

              {/* ADVANTAGES BLOCK */}
              {visibleBlocks.advantages && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader('advantages', 'Why KHAN Builders Widget')}
                {expanded.advantages && (
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Section Title</label>
                        <input type="text" value={cmsData.home.advantageTitle} onChange={(e) => handleChange('home', 'advantageTitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Section Subtitle</label>
                        <input type="text" value={cmsData.home.advantageSubtitle} onChange={(e) => handleChange('home', 'advantageSubtitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {(cmsData.home.advantages || []).map((adv, index) => (
                        <div key={index} className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <GripVertical size={20} className="text-gray-300 mt-2 cursor-grab" />
                          <div className="flex-1 space-y-2">
                            <input type="text" value={adv.title} onChange={(e) => handleAdvantageChange(index, 'title', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold" placeholder="Advantage Title" />
                            <textarea rows="2" value={adv.desc} onChange={(e) => handleAdvantageChange(index, 'desc', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm resize-none" placeholder="Description"></textarea>
                          </div>
                          <button onClick={() => removeAdvantage(index)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors mt-1 h-fit">Delete</button>
                        </div>
                      ))}
                      <button onClick={addAdvantage} className="w-full flex justify-center items-center py-3 bg-navy text-white hover:bg-gold rounded-xl font-bold transition-colors">
                        <Plus size={18} className="mr-2" /> Add Advantage Item
                      </button>
                    </div>
                  </div>
                )}
              </div>
              )}

              {/* AMENITIES BLOCK */}
              {visibleBlocks.amenities && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader('amenities', 'Amenities Widget')}
                {expanded.amenities && (
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Section Title</label>
                        <input type="text" value={cmsData.home.amenitiesTitle} onChange={(e) => handleChange('home', 'amenitiesTitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Section Subtitle</label>
                        <input type="text" value={cmsData.home.amenitiesSubtitle} onChange={(e) => handleChange('home', 'amenitiesSubtitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {(cmsData.home.amenities || []).map((amenity, index) => (
                        <div key={index} className="flex gap-3 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <GripVertical size={20} className="text-gray-300 cursor-grab" />
                          <select value={amenity.icon} onChange={(e) => handleAmenityChange(index, 'icon', e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                            <option value="Dumbbell">Dumbbell</option>
                            <option value="Droplets">Pool</option>
                            <option value="TreePine">Garden</option>
                            <option value="ShieldCheck">Security</option>
                            <option value="CheckCircle">Check</option>
                          </select>
                          <input type="text" value={amenity.text} onChange={(e) => handleAmenityChange(index, 'text', e.target.value)} className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold" placeholder="Amenity Text" />
                          <button onClick={() => removeAmenity(index)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Delete</button>
                        </div>
                      ))}
                      <button onClick={addAmenity} className="w-full flex justify-center items-center py-3 bg-navy text-white hover:bg-gold rounded-xl font-bold transition-colors">
                        <Plus size={18} className="mr-2" /> Add Amenity Item
                      </button>
                    </div>
                  </div>
                )}
              </div>
              )}
              
              {/* CTA BLOCK */}
              {visibleBlocks.cta && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader('cta', 'Call To Action Block')}
                {expanded.cta && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">CTA Title</label>
                      <input type="text" value={cmsData.home.ctaTitle} onChange={(e) => handleChange('home', 'ctaTitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">CTA Subtitle</label>
                      <input type="text" value={cmsData.home.ctaSubtitle} onChange={(e) => handleChange('home', 'ctaSubtitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm" />
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
          )}

          {/* ABOUT PAGE BLOCKS */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              {visibleBlocks.aboutHero && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader('aboutHero', 'Hero Banner Section')}
                {expanded.aboutHero && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                      <input type="text" value={cmsData.about.heroTitle} onChange={(e) => handleChange('about', 'heroTitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Subtitle</label>
                      <input type="text" value={cmsData.about.heroSubtitle} onChange={(e) => handleChange('about', 'heroSubtitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Background Image URL</label>
                      <input type="text" value={cmsData.about.heroImage} onChange={(e) => handleChange('about', 'heroImage', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-blue-500" />
                    </div>
                  </div>
                )}
              </div>
              )}

              {visibleBlocks.story && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader('story', 'Rich Article: Our Story')}
                {expanded.story && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Journey Subtitle</label>
                      <input type="text" value={cmsData.about.journeySubtitle} onChange={(e) => handleChange('about', 'journeySubtitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" placeholder="The Journey" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Journey Header</label>
                      <input type="text" value={cmsData.about.journeyTitle} onChange={(e) => handleChange('about', 'journeyTitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" placeholder="Journey Header" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Journey Image URL</label>
                      <input type="text" value={cmsData.about.journeyImage} onChange={(e) => handleChange('about', 'journeyImage', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-blue-500" placeholder="Image URL" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Company Story</label>
                      <textarea rows="4" value={cmsData.about.story} onChange={(e) => handleChange('about', 'story', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm resize-none" placeholder="Company Story"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Mission Title</label>
                      <input type="text" value={cmsData.about.missionTitle} onChange={(e) => handleChange('about', 'missionTitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" placeholder="Our Mission" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Mission</label>
                      <textarea rows="3" value={cmsData.about.mission} onChange={(e) => handleChange('about', 'mission', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm resize-none" placeholder="Mission Statement"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Vision Title</label>
                      <input type="text" value={cmsData.about.visionTitle} onChange={(e) => handleChange('about', 'visionTitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" placeholder="Our Vision" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Vision</label>
                      <textarea rows="3" value={cmsData.about.vision} onChange={(e) => handleChange('about', 'vision', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm resize-none" placeholder="Vision Statement"></textarea>
                    </div>
                  </div>
                )}
              </div>
              )}

              {visibleBlocks.aboutTeam && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader('aboutTeam', 'Leadership Team')}
                {expanded.aboutTeam && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Leadership Subtitle</label>
                      <input type="text" value={cmsData.about.leadershipSubtitle} onChange={(e) => handleChange('about', 'leadershipSubtitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold mb-4" placeholder="Leadership" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Leadership Title</label>
                      <input type="text" value={cmsData.about.leadershipTitle} onChange={(e) => handleChange('about', 'leadershipTitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold mb-4" placeholder="Meet Our Team" />
                    </div>
                    {(cmsData.about.team || []).map((member, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <GripVertical size={20} className="text-gray-300 cursor-grab mt-2" />
                        <div className="flex-1 space-y-3 w-full">
                          <input type="text" value={member.name} onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold" placeholder="Member Name" />
                          <input type="text" value={member.role} onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" placeholder="Member Role" />
                          <input type="text" value={member.img} onChange={(e) => handleTeamMemberChange(index, 'img', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-500" placeholder="Image URL (Unsplash)" />
                        </div>
                        <button onClick={() => removeTeamMember(index)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors mt-1 h-fit">Delete</button>
                      </div>
                    ))}
                    <button onClick={addTeamMember} className="w-full flex justify-center items-center py-3 bg-navy text-white hover:bg-gold rounded-xl font-bold transition-colors">
                      <Plus size={18} className="mr-2" /> Add Team Member
                    </button>
                  </div>
                )}
              </div>
              )}
            </div>
          )}

          {/* CONTACT BLOCKS */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              {visibleBlocks.contact && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader('contact', 'Contact Header Block')}
                {expanded.contact && (
                  <div className="p-6 space-y-4">
                    <input type="text" value={cmsData.contact.title} onChange={(e) => handleChange('contact', 'title', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" placeholder="Contact Title" />
                    <input type="text" value={cmsData.contact.subtitle} onChange={(e) => handleChange('contact', 'subtitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm" placeholder="Contact Subtitle" />
                    <input type="text" value={cmsData.contact.officeHours} onChange={(e) => handleChange('contact', 'officeHours', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" placeholder="Office Hours" />
                  </div>
                )}
              </div>
              )}

              {visibleBlocks.contactInfo && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader('contactInfo', 'Contact Information')}
                {expanded.contactInfo && (
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Head Office Address</label>
                      <input type="text" value={cmsData.contact.address} onChange={(e) => handleChange('contact', 'address', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" placeholder="Full Address" />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">Phone Numbers</label>
                      <div className="space-y-2">
                        {(cmsData.contact.phones || []).map((phone, index) => (
                          <div key={index} className="flex gap-2">
                            <input type="text" value={phone} onChange={(e) => handlePhoneChange(index, e.target.value)} className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm" placeholder="e.g. +91 98765 43210" />
                            <button onClick={() => removePhone(index)} className="px-3 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-sm font-bold"><Trash2 size={16} /></button>
                          </div>
                        ))}
                        <button onClick={addPhone} className="text-sm font-bold text-navy hover:text-gold flex items-center"><Plus size={14} className="mr-1" /> Add Phone</button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">Email Addresses</label>
                      <div className="space-y-2">
                        {(cmsData.contact.emails || []).map((email, index) => (
                          <div key={index} className="flex gap-2">
                            <input type="email" value={email} onChange={(e) => handleEmailChange(index, e.target.value)} className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm" placeholder="e.g. info@domain.com" />
                            <button onClick={() => removeEmail(index)} className="px-3 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-sm font-bold"><Trash2 size={16} /></button>
                          </div>
                        ))}
                        <button onClick={addEmail} className="text-sm font-bold text-navy hover:text-gold flex items-center"><Plus size={14} className="mr-1" /> Add Email</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
          )}

          {/* TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              {visibleBlocks.testimonials && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader('testimonials', 'Testimonials Block')}
                {expanded.testimonials && (
                  <div className="p-6 space-y-4">
                    {(cmsData.testimonials || []).map((test, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative group">
                        <div className="absolute top-4 right-4">
                          <button onClick={() => removeTestimonial(index)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Delete</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 pr-20">
                          <input type="text" value={test.name} onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold" placeholder="Client Name" />
                          <input type="text" value={test.role} onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" placeholder="Role" />
                        </div>
                        <textarea rows="3" value={test.review} onChange={(e) => handleTestimonialChange(index, 'review', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm resize-none" placeholder="Review"></textarea>
                      </div>
                    ))}
                    <button onClick={addTestimonial} className="w-full flex justify-center items-center py-3 bg-navy text-white hover:bg-gold rounded-xl font-bold transition-colors">
                      <Plus size={18} className="mr-2" /> Add Testimonial Item
                    </button>
                  </div>
                )}
              </div>
              )}
            </div>
          )}

          {/* FAQS */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              {visibleBlocks.faqs && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader('faqs', 'FAQ Block')}
                {expanded.faqs && (
                  <div className="p-6 space-y-4">
                    {(cmsData.faqs || []).map((faq, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative group">
                        <div className="absolute top-4 right-4">
                          <button onClick={() => removeFaq(index)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Delete</button>
                        </div>
                        <div className="mb-3 pr-20">
                          <input type="text" value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold" placeholder="Question" />
                        </div>
                        <textarea rows="2" value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm resize-none" placeholder="Answer"></textarea>
                      </div>
                    ))}
                    <button onClick={addFaq} className="w-full flex justify-center items-center py-3 bg-navy text-white hover:bg-gold rounded-xl font-bold transition-colors">
                      <Plus size={18} className="mr-2" /> Add FAQ Item
                    </button>
                  </div>
                )}
              </div>
              )}
            </div>
          )}

          {/* OTHER TABS */}
          {['propertiesSale', 'propertiesRent', 'gallery'].includes(activeTab) && (
            <div className="space-y-6">
              {visibleBlocks[activeTab] && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader(activeTab, 'Header Title Block')}
                <div className="p-6 space-y-4">
                  <input type="text" value={cmsData[activeTab].title} onChange={(e) => handleChange(activeTab, 'title', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold" placeholder="Title" />
                  <input type="text" value={cmsData[activeTab].subtitle} onChange={(e) => handleChange(activeTab, 'subtitle', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm" placeholder="Subtitle" />
                </div>
              </div>
              )}

              {activeTab === 'gallery' && visibleBlocks.galleryImages && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {renderAccordionHeader('galleryImages', 'Gallery Images')}
                {expanded.galleryImages && (
                  <div className="p-6 space-y-4">
                    {(cmsData.gallery.images || []).map((img, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <GripVertical size={20} className="text-gray-300 cursor-grab mt-2" />
                        <div className="flex-1 space-y-3 w-full">
                          <input type="text" value={img.project} onChange={(e) => handleGalleryImageChange(index, 'project', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold" placeholder="Project Name" />
                          <select value={img.category} onChange={(e) => handleGalleryImageChange(index, 'category', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                            <option value="All">All</option>
                            <option value="Exteriors">Exteriors</option>
                            <option value="Interiors">Interiors</option>
                            <option value="Amenities">Amenities</option>
                            <option value="Ongoing Projects">Ongoing Projects</option>
                          </select>
                          <input type="text" value={img.url} onChange={(e) => handleGalleryImageChange(index, 'url', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-500" placeholder="Image URL" />
                        </div>
                        <button onClick={() => removeGalleryImage(index)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors mt-1 h-fit">Delete</button>
                      </div>
                    ))}
                    <button onClick={addGalleryImage} className="w-full flex justify-center items-center py-3 bg-navy text-white hover:bg-gold rounded-xl font-bold transition-colors">
                      <Plus size={18} className="mr-2" /> Add Image
                    </button>
                  </div>
                )}
              </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ADD NEW SECTION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
              <div>
                <h2 className="text-2xl font-black text-navy">Add Content Block</h2>
                <p className="text-sm text-gray-500">Choose a template to quickly add a new section to the page.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-navy bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto bg-gray-50">
              {[
                { id: 'hero', icon: LayoutGrid, title: 'Hero Banner', desc: 'Large header banner with title and subtitle.', color: 'text-blue-500', tab: 'home' },
                { id: 'stats', icon: Type, title: 'Statistics', desc: 'Display key numbers or achievements visually.', color: 'text-purple-500', tab: 'home' },
                { id: 'advantages', icon: Info, title: 'Why Us Widget', desc: 'Highlights the key features of the company.', color: 'text-green-600', tab: 'home' },
                { id: 'amenities', icon: ImageIcon, title: 'Amenities', desc: 'List of world-class amenities.', color: 'text-teal-600', tab: 'home' },
                { id: 'cta', icon: LayoutGrid, title: 'Call to Action', desc: 'CTA banner at the bottom.', color: 'text-orange-500', tab: 'home' },
                
                { id: 'aboutHero', icon: LayoutGrid, title: 'About Hero', desc: 'Hero banner for the About page.', color: 'text-blue-600', tab: 'about' },
                { id: 'story', icon: FileText, title: 'Rich Article', desc: 'A full-width text editor for articles and paragraphs.', color: 'text-green-500', tab: 'about' },
                { id: 'aboutTeam', icon: ImageIcon, title: 'Leadership Team', desc: 'Team members list with names, roles, and images.', color: 'text-indigo-600', tab: 'about' },
                
                { id: 'contact', icon: LayoutGrid, title: 'Contact Header', desc: 'Contact page title and subtitle.', color: 'text-blue-500', tab: 'contact' },
                { id: 'contactInfo', icon: Phone, title: 'Contact Info', desc: 'Address, phones, and emails block.', color: 'text-orange-600', tab: 'contact' },
                
                { id: 'faqs', icon: HelpCircle, title: 'FAQ Block', desc: 'A list of questions and detailed answers.', color: 'text-orange-500', tab: 'faqs' },
                { id: 'testimonials', icon: MessageSquare, title: 'Testimonials', desc: 'Client reviews and feedback sliders.', color: 'text-pink-500', tab: 'testimonials' },
                
                { id: 'gallery', icon: LayoutGrid, title: 'Gallery Header', desc: 'Gallery title and subtitle.', color: 'text-indigo-500', tab: 'gallery' },
                { id: 'galleryImages', icon: ImageIcon, title: 'Gallery Images List', desc: 'Manage the images shown in the gallery.', color: 'text-teal-500', tab: 'gallery' },

                { id: 'propertiesSale', icon: LayoutGrid, title: 'Sale Header', desc: 'Properties for Sale Header.', color: 'text-blue-500', tab: 'propertiesSale' },
                { id: 'propertiesRent', icon: LayoutGrid, title: 'Rent Header', desc: 'Properties for Rent Header.', color: 'text-green-500', tab: 'propertiesRent' }
              ].filter(t => t.tab === activeTab).map((template, idx) => (
                <div key={idx} onClick={() => { 
                  setShowModal(false); 
                  setVisibleBlocks(prev => ({ ...prev, [template.id]: true }));
                  setExpanded(prev => ({ ...prev, [template.id]: true }));
                  toast.success(template.title + ' added!'); 
                }} className="bg-white group border border-gray-200 hover:border-navy rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg">
                  <div className={`w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${template.color}`}>
                    <template.icon size={24} />
                  </div>
                  <h3 className="font-bold text-navy text-lg mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{template.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* CUSTOM CONFIRMATION MODAL */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
                <Trash2 size={24} />
              </div>
              <h2 className="text-xl font-black text-navy mb-2">{confirmDialog.title}</h2>
              <p className="text-gray-500">{confirmDialog.message}</p>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setConfirmDialog({ isOpen: false, onConfirm: null })}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className="px-5 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
