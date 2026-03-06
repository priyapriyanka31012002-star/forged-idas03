import React from 'react';
import { Box, Typography, Stack, Avatar, alpha, Card, CardContent, Chip } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlagIcon from '@mui/icons-material/Flag';
import TimelineIcon from '@mui/icons-material/Timeline';

const STATUS_ORDER = ['draft', 'estimated', 'quoted', 'order_confirmed', 'in_production', 'inspected', 'shipped', 'closed'];

const TIMELINE_EVENTS = [
  { key: 'draft', label: 'Project Created', desc: 'RFQ received and project initiated', icon: <DescriptionIcon sx={{ fontSize: 18 }} />, color: '#64748B' },
  { key: 'estimated', label: 'Estimation Complete', desc: 'Cost estimation and material requirements finalized', icon: <EngineeringIcon sx={{ fontSize: 18 }} />, color: '#3B82F6' },
  { key: 'quoted', label: 'Quotation Sent', desc: 'Formal quotation sent to client with pricing', icon: <AttachMoneyIcon sx={{ fontSize: 18 }} />, color: '#D97706' },
  { key: 'order_confirmed', label: 'Client PO Received', desc: 'Purchase order confirmed and work order generated', icon: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />, color: '#7C3AED' },
  { key: 'vendor_po', label: 'Vendor PO Issued', desc: 'Materials ordered from suppliers', icon: <ShoppingCartIcon sx={{ fontSize: 18 }} />, color: '#0891B2' },
  { key: 'in_production', label: 'Production Started', desc: 'Manufacturing work order in progress', icon: <PrecisionManufacturingIcon sx={{ fontSize: 18 }} />, color: '#714CF7' },
  { key: 'inspected', label: 'Quality Inspection', desc: 'Quality checks and certifications completed', icon: <VerifiedIcon sx={{ fontSize: 18 }} />, color: '#059669' },
  { key: 'shipped', label: 'Shipped', desc: 'Packing complete and dispatched to client', icon: <LocalShippingIcon sx={{ fontSize: 18 }} />, color: '#0891B2' },
  { key: 'closed', label: 'Project Closed', desc: 'All deliverables completed and project archived', icon: <FlagIcon sx={{ fontSize: 18 }} />, color: '#475569' },
];

const cardSx = {
  border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function TimelineTab({ project }) {
  const currentIdx = STATUS_ORDER.indexOf(project.status);
  const completedStages = Math.max(0, currentIdx);
  const totalStages = STATUS_ORDER.length;

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TimelineIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>Project Timeline</Typography>
        </Stack>
        <Chip label={`Stage ${completedStages + 1} of ${totalStages}`} size="small"
          sx={{ bgcolor: '#F5F3FF', color: '#714CF7', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
      </Stack>

      <Card elevation={0} sx={cardSx}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
      <Box sx={{ position: 'relative', pl: 4 }}>
        {/* Vertical line */}
        <Box sx={{
          position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, bgcolor: '#E2E8F0',
        }} />

        <Stack spacing={0}>
          {TIMELINE_EVENTS.map((event, idx) => {
            const eventIdx = STATUS_ORDER.indexOf(event.key);
            const isVendorPO = event.key === 'vendor_po';
            const done = isVendorPO
              ? currentIdx >= STATUS_ORDER.indexOf('in_production')
              : currentIdx > eventIdx;
            const active = isVendorPO
              ? currentIdx === STATUS_ORDER.indexOf('order_confirmed')
              : currentIdx === eventIdx;
            const isFuture = !done && !active;

            return (
              <Stack key={event.key} direction="row" spacing={2.5} alignItems="flex-start"
                sx={{ position: 'relative', py: 2, opacity: isFuture ? 0.45 : 1, transition: 'opacity 0.3s' }}>
                {/* Timeline dot */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Avatar sx={{
                    width: 38, height: 38,
                    bgcolor: done ? event.color : active ? alpha(event.color, 0.12) : '#F8FAFC',
                    color: done ? '#fff' : active ? event.color : '#CBD5E1',
                    border: `2px solid ${done ? event.color : active ? event.color : '#E2E8F0'}`,
                    transition: 'all 0.3s',
                    boxShadow: active ? `0 0 0 4px ${alpha(event.color, 0.15)}` : 'none',
                  }}>
                    {event.icon}
                  </Avatar>
                </Box>

                {/* Content */}
                <Box sx={{
                  flex: 1, pb: 1, borderBottom: idx < TIMELINE_EVENTS.length - 1 ? '1px solid #F1F5F9' : 'none',
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography sx={{
                      fontSize: '0.88rem', fontWeight: active ? 700 : 600,
                      color: done || active ? '#0F172A' : '#94A3B8',
                    }}>
                      {event.label}
                    </Typography>
                    {done && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#059669', fontWeight: 600, bgcolor: '#ECFDF5', px: 1, py: 0.25, borderRadius: 1 }}>
                        Completed
                      </Typography>
                    )}
                    {active && (
                      <Typography sx={{ fontSize: '0.65rem', color: event.color, fontWeight: 600, bgcolor: alpha(event.color, 0.08), px: 1, py: 0.25, borderRadius: 1 }}>
                        Current Stage
                      </Typography>
                    )}
                    {isFuture && (
                      <Typography sx={{ fontSize: '0.65rem', color: '#CBD5E1', fontWeight: 500 }}>
                        Pending
                      </Typography>
                    )}
                  </Stack>
                  <Typography sx={{
                    fontSize: '0.76rem', color: done || active ? '#64748B' : '#CBD5E1', lineHeight: 1.5,
                  }}>
                    {event.desc}
                  </Typography>
                  {(done || active) && project.updated_at && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', mt: 0.75 }}>
                      {done && idx === 0 ? `Created: ${project.created_at || 'N/A'}` : ''}
                      {active ? `Since: ${project.updated_at}` : ''}
                    </Typography>
                  )}
                </Box>
              </Stack>
            );
          })}
        </Stack>
      </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
