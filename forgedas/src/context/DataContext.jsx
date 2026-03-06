import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext(null);

const initialCompanies = [
  { id: 1, company_name: 'Forge Industries LLC', short_code: 'FI', address: '500 Manufacturing Blvd, Houston TX 77001', gst_number: 'GST-FI-2024-001', registration_number: 'LLC-TX-889012', country: 'USA', currency: 'USD', logo_initials: 'FI' },
  { id: 2, company_name: 'Forge Precision Works', short_code: 'FPW', address: '120 Precision Lane, Calgary AB T2P 1J9', gst_number: 'GST-FPW-2024-002', registration_number: 'AB-COR-445678', country: 'Canada', currency: 'CAD', logo_initials: 'FP' },
  { id: 3, company_name: 'Forge Asia Pacific Pte', short_code: 'FAP', address: '88 Jurong Industrial Road, Singapore 628990', gst_number: 'GST-FAP-2024-003', registration_number: 'SG-UEN-201900123', country: 'Singapore', currency: 'SGD', logo_initials: 'FA' },
];

const initialClients = [
  { id: 1, company_id: 1, client_name: 'Apex Heavy Industries', address: '1200 Industrial Park, Houston TX', poc_name: 'Robert Chen', poc_email: 'rchen@apex.com', poc_phone: '+1-713-555-0101', industry: 'Oil & Gas', payment_terms: 'Net 30', credit_limit: 500000, created_at: '2025-11-15' },
  { id: 2, company_id: 1, client_name: 'Meridian Oil & Gas', address: '456 Energy Blvd, Calgary AB', poc_name: 'Amanda Wells', poc_email: 'awells@meridian.com', poc_phone: '+1-403-555-0202', industry: 'Oil & Gas', payment_terms: 'Net 45', credit_limit: 750000, created_at: '2025-12-01' },
  { id: 3, company_id: 3, client_name: 'Pacific Valve Corp', address: '789 Marine Drive, Singapore', poc_name: 'David Tan', poc_email: 'dtan@pacvalve.sg', poc_phone: '+65-6555-0303', industry: 'Marine & Offshore', payment_terms: 'Net 30', credit_limit: 300000, created_at: '2026-01-10' },
  { id: 4, company_id: 2, client_name: 'Northern Pipeline Co', address: '200 Pipeline Road, Edmonton AB', poc_name: 'James Murray', poc_email: 'jmurray@northpipe.ca', poc_phone: '+1-780-555-0404', industry: 'Pipeline', payment_terms: '50% Advance', credit_limit: 400000, created_at: '2026-01-20' },
  { id: 5, company_id: 1, client_name: 'Gulf Petrochemicals', address: '90 Refinery Row, Jubail', poc_name: 'Ahmed Al-Rashid', poc_email: 'arashid@gulfpetro.sa', poc_phone: '+966-13-555-0505', industry: 'Petrochemical', payment_terms: 'LC at Sight', credit_limit: 1000000, created_at: '2026-02-01' },
];

const initialVendors = [
  { id: 1, vendor_name: 'SteelMax Suppliers', address: '321 Steel Yard, Pittsburgh PA', contact_person: 'Greg Miller', contact_email: 'gmiller@steelmax.com', contact_phone: '+1-412-555-0401', specialization: 'Carbon & Stainless Steel', rating: 4.5, lead_time_days: 14, payment_terms: 'Net 30' },
  { id: 2, vendor_name: 'AlloyTech Materials', address: '654 Metals Ave, Mumbai', contact_person: 'Priya Sharma', contact_email: 'psharma@alloytech.in', contact_phone: '+91-22-5550-502', specialization: 'Alloy Steels & Nickel Alloys', rating: 4.2, lead_time_days: 21, payment_terms: 'Net 45' },
  { id: 3, vendor_name: 'Precision Tools Inc', address: '987 Tool Way, Detroit MI', contact_person: 'Mark Johnson', contact_email: 'mjohnson@prectools.com', contact_phone: '+1-313-555-0603', specialization: 'Cutting Tools & Inserts', rating: 4.8, lead_time_days: 7, payment_terms: 'Net 15' },
  { id: 4, vendor_name: 'CastWell Foundries', address: '112 Foundry Rd, Coimbatore', contact_person: 'Rajesh Kumar', contact_email: 'rkumar@castwell.in', contact_phone: '+91-422-555-0704', specialization: 'Cast Iron & Steel Castings', rating: 4.0, lead_time_days: 28, payment_terms: 'Net 30' },
  { id: 5, vendor_name: 'Welding Solutions GmbH', address: '45 Schweisserstr, Düsseldorf', contact_person: 'Hans Weber', contact_email: 'hweber@weldsol.de', contact_phone: '+49-211-555-0805', specialization: 'Welding Consumables & Gas', rating: 4.6, lead_time_days: 10, payment_terms: 'Net 30' },
];

const initialVendorPOs = [
  { id: 1, po_number: 'VPO-2026-001', project_id: 1, vendor_id: 1, status: 'delivered', items: [{ material: 'SS316', grade: 'SS316L', quantity: 2, unit: 'pcs', unit_price: 1200, total: 2400 }], total_amount: 2400, created_at: '2026-01-18', delivery_date: '2026-02-01', notes: 'Raw material for flange assembly' },
  { id: 2, po_number: 'VPO-2026-002', project_id: 4, vendor_id: 2, status: 'delivered', items: [{ material: 'F22', grade: 'ASTM A182 F22', quantity: 1, unit: 'pcs', unit_price: 1800, total: 1800 }], total_amount: 1800, created_at: '2025-12-15', delivery_date: '2025-12-24', notes: 'Wellhead adapter material' },
];

const initialRFQs = [
  { id: 1, rfq_number: 'RFQ-2026-001', client_id: 1, subject: 'Custom Flange Assembly - 24"', description: 'Need custom 24-inch flange assembly per API specs', status: 'converted', project_id: 1, created_at: '2026-01-10', due_date: '2026-01-20' },
  { id: 2, rfq_number: 'RFQ-2026-002', client_id: 2, subject: 'Pressure Vessel Nozzle Set', description: 'Set of nozzles for pressure vessel per ASME', status: 'converted', project_id: 2, created_at: '2026-01-25', due_date: '2026-02-05' },
  { id: 3, rfq_number: 'RFQ-2026-003', client_id: 3, subject: 'Coupling Sleeve Batch - 50 pcs', description: 'Batch of 50 coupling sleeves, carbon steel', status: 'converted', project_id: 3, created_at: '2026-02-15', due_date: '2026-02-28' },
  { id: 4, rfq_number: 'RFQ-2026-004', client_id: 1, subject: 'Gate Valve Body Machining', description: '8-inch gate valve body, ASTM A216 WCB', status: 'open', project_id: null, created_at: '2026-03-01', due_date: '2026-03-15' },
];

const STATUS_FLOW = ['draft', 'estimated', 'quoted', 'order_confirmed', 'in_production', 'inspected', 'shipped', 'closed'];

const initialProjects = [
  {
    id: 1, project_code: 'FI-PRJ-2026-001', project_name: 'Custom Flange Assembly - 24"', company_id: 1, client_id: 1, prepared_by: 'John Engineer',
    manager: 'Sarah Sales', priority: 'high', category: 'Flanges & Fittings', description: '24-inch custom flange assembly per API 6A specification for subsea application.',
    revision: 'R1', status: 'in_production', created_at: '2026-01-15', updated_at: '2026-02-10',
    estimate: {
      id: 1, total_cost: 12500, margin_percent: 25, final_price: 15625, approved_at: '2026-01-20',
      items: [
        { id: 1, module_type: 'turning', input_json: { diameter: 24, length: 6, material: 'SS316', rpm: 800, feed_rate: 0.2 }, calculated_json: { machine_time: 4.5, labor_cost: 450, tool_cost: 120 }, total_cost: 3200 },
        { id: 2, module_type: 'milling', input_json: { width: 24, depth: 2, slots: 8, material: 'SS316' }, calculated_json: { machine_time: 3.2, labor_cost: 320, tool_cost: 95 }, total_cost: 2800 },
        { id: 3, module_type: 'welding', input_json: { weld_type: 'TIG', joint_length: 75, passes: 3 }, calculated_json: { filler_cost: 180, gas_cost: 60, labor_cost: 520 }, total_cost: 1800 },
        { id: 4, module_type: 'heat_treatment', input_json: { process: 'Stress Relief', temp: 620, hold_time: 4, cooling: 'Furnace' }, calculated_json: { energy_cost: 280, labor_cost: 150 }, total_cost: 950 },
      ],
    },
    quotation: { validity_date: '2026-03-20', delivery_time: '6-8 weeks', payment_terms: 'Net 30', notes: 'FOB Origin. Includes MTR and CoC.' },
    sales_order: { customer_po_number: 'APX-PO-2026-0312', accepted_date: '2026-02-01' },
    work_order: { work_order_number: 'WO-2026-001', release_date: '2026-02-05' },
    quality: { dimensional: true, visual: true, hardness: false, ndt: false, pressure: false, mtr: true },
    logistics: {},
    documents: [
      { id: 1, document_type: 'quotation', version: 1, status: 'final', generated_by: 'Sarah Sales', generated_at: '2026-01-22' },
      { id: 2, document_type: 'work_order', version: 1, status: 'final', generated_by: 'Admin User', generated_at: '2026-02-05' },
    ],
  },
  {
    id: 2, project_code: 'FI-PRJ-2026-002', project_name: 'Pressure Vessel Nozzle Set', company_id: 1, client_id: 2, prepared_by: 'John Engineer',
    manager: 'Sarah Sales', priority: 'medium', category: 'Pressure Vessels', description: 'Set of 6 nozzles for pressure vessel per ASME Section VIII Div.1.',
    revision: 'R2', status: 'quoted', created_at: '2026-02-01', updated_at: '2026-02-18',
    estimate: {
      id: 2, total_cost: 28400, margin_percent: 22, final_price: 34648, approved_at: '2026-02-12',
      items: [
        { id: 5, module_type: 'turning', input_json: { diameter: 12, length: 18, material: 'A105', rpm: 1200, feed_rate: 0.15 }, calculated_json: { machine_time: 6.8, labor_cost: 680, tool_cost: 200 }, total_cost: 5400 },
        { id: 6, module_type: 'milling', input_json: { width: 12, depth: 3, slots: 4, material: 'A105' }, calculated_json: { machine_time: 2.1, labor_cost: 210, tool_cost: 65 }, total_cost: 1800 },
        { id: 7, module_type: 'welding', input_json: { weld_type: 'SMAW', joint_length: 120, passes: 5 }, calculated_json: { filler_cost: 340, gas_cost: 0, labor_cost: 980 }, total_cost: 4200 },
      ],
    },
    quotation: { validity_date: '2026-04-01', delivery_time: '8-10 weeks', payment_terms: '50% advance, balance before dispatch', notes: 'Includes hydrotest and NDT.' },
    sales_order: null,
    work_order: null,
    quality: {},
    logistics: {},
    documents: [
      { id: 3, document_type: 'quotation', version: 2, status: 'final', generated_by: 'Sarah Sales', generated_at: '2026-02-15' },
    ],
  },
  {
    id: 3, project_code: 'FAP-PRJ-2026-001', project_name: 'Coupling Sleeve Batch - 50 pcs', company_id: 3, client_id: 3, prepared_by: 'John Engineer',
    manager: 'David Tan', priority: 'low', category: 'Couplings & Sleeves', description: 'Batch production of 50 coupling sleeves, carbon steel, for marine application.',
    revision: 'R1', status: 'draft', created_at: '2026-02-20', updated_at: '2026-02-20',
    estimate: { id: 3, total_cost: 0, margin_percent: 20, final_price: 0, approved_at: null, items: [] },
    quotation: null,
    sales_order: null,
    work_order: null,
    quality: {},
    logistics: {},
    documents: [],
  },
  {
    id: 4, project_code: 'FI-PRJ-2025-047', project_name: 'Wellhead Adapter Flange', company_id: 1, client_id: 2, prepared_by: 'John Engineer',
    manager: 'John Engineer', priority: 'high', category: 'Wellhead Equipment', description: 'Wellhead adapter flange per API 6A, ASTM A182 F22 material.',
    revision: 'R1', status: 'inspected', created_at: '2025-12-10', updated_at: '2026-02-22',
    estimate: {
      id: 4, total_cost: 8900, margin_percent: 30, final_price: 11570, approved_at: '2025-12-18',
      items: [
        { id: 8, module_type: 'turning', input_json: { diameter: 16, length: 8, material: 'F22', rpm: 900, feed_rate: 0.18 }, calculated_json: { machine_time: 3.8, labor_cost: 380, tool_cost: 110 }, total_cost: 2900 },
        { id: 9, module_type: 'heat_treatment', input_json: { process: 'Normalize + Temper', temp: 870, hold_time: 6, cooling: 'Air' }, calculated_json: { energy_cost: 420, labor_cost: 200 }, total_cost: 1200 },
      ],
    },
    quotation: { validity_date: '2026-01-15', delivery_time: '4-5 weeks', payment_terms: 'Net 45', notes: 'As per API 6A specs.' },
    sales_order: { customer_po_number: 'MER-PO-2025-1188', accepted_date: '2025-12-22' },
    work_order: { work_order_number: 'WO-2025-047', release_date: '2025-12-26' },
    quality: { dimensional: true, visual: true, hardness: true, ndt: true, pressure: true, mtr: true },
    logistics: { shipment_method: 'LTL Freight', packaging: 'Wooden crate, VCI wrap', dispatch_date: null },
    documents: [
      { id: 4, document_type: 'quotation', version: 1, status: 'final', generated_by: 'Sarah Sales', generated_at: '2025-12-18' },
      { id: 5, document_type: 'work_order', version: 1, status: 'final', generated_by: 'Admin User', generated_at: '2025-12-26' },
      { id: 6, document_type: 'coc', version: 1, status: 'final', generated_by: 'Lisa Quality', generated_at: '2026-02-20' },
    ],
  },
  {
    id: 5, project_code: 'FPW-PRJ-2026-001', project_name: 'Pipeline Tee Junction - 16"', company_id: 2, client_id: 4, prepared_by: 'Mike Wilson',
    manager: 'Mike Wilson', priority: 'high', category: 'Pipeline Components', description: '16-inch pipeline tee junction, ASTM A860 WPHY65, for sour service.',
    revision: 'R1', status: 'estimated', created_at: '2026-02-05', updated_at: '2026-02-25',
    estimate: {
      id: 5, total_cost: 18200, margin_percent: 28, final_price: 23296, approved_at: '2026-02-20',
      items: [
        { id: 10, module_type: 'turning', input_json: { diameter: 16, length: 12, material: 'WPHY65', rpm: 700, feed_rate: 0.15 }, calculated_json: { machine_time: 5.2, labor_cost: 520, tool_cost: 145 }, total_cost: 3800 },
        { id: 11, module_type: 'welding', input_json: { weld_type: 'SAW', joint_length: 200, passes: 6 }, calculated_json: { filler_cost: 480, gas_cost: 0, labor_cost: 1400 }, total_cost: 5600 },
        { id: 12, module_type: 'heat_treatment', input_json: { process: 'Normalize + Temper', temp: 910, hold_time: 8, cooling: 'Air' }, calculated_json: { energy_cost: 580, labor_cost: 280 }, total_cost: 1800 },
      ],
    },
    quotation: null, sales_order: null, work_order: null,
    quality: {}, logistics: {}, documents: [],
  },
  {
    id: 6, project_code: 'FI-PRJ-2026-003', project_name: 'Valve Body Machining - 8"', company_id: 1, client_id: 5, prepared_by: 'John Engineer',
    manager: 'Sarah Sales', priority: 'medium', category: 'Valves', description: '8-inch gate valve body, ASTM A216 WCB, for petrochemical plant.',
    revision: 'R1', status: 'order_confirmed', created_at: '2026-01-28', updated_at: '2026-03-01',
    estimate: {
      id: 6, total_cost: 9800, margin_percent: 25, final_price: 12250, approved_at: '2026-02-05',
      items: [
        { id: 13, module_type: 'turning', input_json: { diameter: 8, length: 14, material: 'WCB', rpm: 1000, feed_rate: 0.2 }, calculated_json: { machine_time: 3.1, labor_cost: 310, tool_cost: 90 }, total_cost: 2400 },
        { id: 14, module_type: 'milling', input_json: { width: 8, depth: 4, slots: 6, material: 'WCB' }, calculated_json: { machine_time: 2.8, labor_cost: 280, tool_cost: 85 }, total_cost: 2100 },
      ],
    },
    quotation: { validity_date: '2026-03-15', delivery_time: '5-6 weeks', payment_terms: 'LC at Sight', notes: 'Per API 600. Includes PMI and UT.' },
    sales_order: { customer_po_number: 'GPC-PO-2026-0089', accepted_date: '2026-02-20' },
    work_order: { work_order_number: 'WO-2026-003', release_date: '2026-02-25' },
    quality: {}, logistics: {},
    documents: [
      { id: 7, document_type: 'quotation', version: 1, status: 'final', generated_by: 'Sarah Sales', generated_at: '2026-02-08' },
      { id: 8, document_type: 'work_order', version: 1, status: 'final', generated_by: 'Admin User', generated_at: '2026-02-25' },
    ],
  },
];

export function DataProvider({ children }) {
  const [companies] = useState(initialCompanies);
  const [clients, setClients] = useState(initialClients);
  const [vendors, setVendors] = useState(initialVendors);
  const [projects, setProjects] = useState(initialProjects);
  const [vendorPOs, setVendorPOs] = useState(initialVendorPOs);
  const [rfqs, setRFQs] = useState(initialRFQs);

  const addClient = (client) => {
    const newClient = { ...client, id: clients.length + 1, created_at: new Date().toISOString().split('T')[0] };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const addVendor = (vendor) => {
    const newVendor = { ...vendor, id: vendors.length + 1 };
    setVendors(prev => [...prev, newVendor]);
    return newVendor;
  };

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: projects.length + 1,
      status: 'draft',
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
      estimate: { id: projects.length + 1, total_cost: 0, margin_percent: 20, final_price: 0, approved_at: null, items: [] },
      quotation: null,
      sales_order: null,
      work_order: null,
      quality: {},
      logistics: {},
      documents: [],
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (id, updates) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString().split('T')[0] } : p));
  };

  const addVendorPO = (vpo) => {
    const newVPO = { ...vpo, id: vendorPOs.length + 1, po_number: `VPO-${new Date().getFullYear()}-${String(vendorPOs.length + 1).padStart(3, '0')}`, created_at: new Date().toISOString().split('T')[0], status: 'draft' };
    setVendorPOs(prev => [...prev, newVPO]);
    return newVPO;
  };

  const updateVendorPO = (id, updates) => {
    setVendorPOs(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const addRFQ = (rfq) => {
    const newRFQ = { ...rfq, id: rfqs.length + 1, rfq_number: `RFQ-${new Date().getFullYear()}-${String(rfqs.length + 1).padStart(3, '0')}`, status: 'open', created_at: new Date().toISOString().split('T')[0] };
    setRFQs(prev => [...prev, newRFQ]);
    return newRFQ;
  };

  const updateRFQ = (id, updates) => {
    setRFQs(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const getClientName = (clientId) => {
    const c = clients.find(c => c.id === clientId);
    return c ? c.client_name : 'Unknown';
  };

  const getVendorName = (vendorId) => {
    const v = vendors.find(v => v.id === vendorId);
    return v ? v.vendor_name : 'Unknown';
  };

  const getCompanyName = (companyId) => {
    const c = companies.find(c => c.id === companyId);
    return c ? c.company_name : 'Unknown';
  };

  const getCompanyCode = (companyId) => {
    const c = companies.find(c => c.id === companyId);
    return c ? c.short_code : '??';
  };

  return (
    <DataContext.Provider value={{
      companies, clients, vendors, projects, vendorPOs, rfqs,
      addClient, addVendor, addProject, updateProject,
      addVendorPO, updateVendorPO, addRFQ, updateRFQ,
      getClientName, getVendorName, getCompanyName, getCompanyCode, STATUS_FLOW,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
export { STATUS_FLOW };
