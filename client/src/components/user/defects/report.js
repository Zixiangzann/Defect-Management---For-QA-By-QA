import { Doughnut, Bar } from 'react-chartjs-2';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, Title, CategoryScale, BarController, BarElement } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

//comp
import { getCountComponents, getCountIssueType, getCountServer, getCountSeverity, getCountStatus } from '../../../store/actions/report'
import { setXSelect, setYSelect, resetReportState } from '../../../store/reducers/report';
import { getAllProjects } from '../../../store/actions/defects';

//MUI
import Box from '@mui/material/Box'
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { IconButton, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button'
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import Table from '@mui/material/Table';
import { DataGrid } from '@material-ui/data-grid'
import Drawer from '@mui/material/Drawer';

ChartJS.register(ArcElement, Tooltip, Legend, Title, LinearScale, CategoryScale, BarController, BarElement, LinearScale);

const Report = () => {


    const [chartType, setChartType] = useState('bar')
    const [selectedProject, setSelectedProject] = useState(false)
    const [project, setProject] = useState('')
    const [totalDefect, setTotalDefect] = useState()
    const [showFilter, setShowFilter] = useState(false)

    const dispatch = useDispatch()
    const report = useSelector(state => state.report.report)
    const defects = useSelector(state => state.defects);

    const handleXAxis = (event) => {
        const value = event.target.value;
        dispatch(setXSelect(value))

    }

    const handleYAxis = (event) => {
        const value = event.target.value;
        dispatch(setYSelect(value))
    
    }

    const generateChart = (event) => {
        const value = event.target.value;
        if (value === 'severity') dispatch(getCountSeverity(project));
        if (value === 'status') dispatch(getCountStatus(project));
        if (value === 'server') dispatch(getCountServer(project));
        if (value === 'components') dispatch(getCountComponents(project));
        if (value === 'issuetype') dispatch(getCountIssueType(project));

    }

    const handleChartType = (event) => {
        const value = event.target.value
        setChartType(value)

    }

    const handleProject = (event) => {
        const value = event.target.value
        setProject(value)
        setSelectedProject(true)
        dispatch(setXSelect('status'))
        dispatch(setYSelect('status'))
    }

    useEffect(() => {
        dispatch(getAllProjects());
        //reset report state to default
        dispatch(resetReportState());
    }, []);

    useEffect(() => {
        //default show "bar chart" with "status" selection
        //get total defect
        let total = 0;
        dispatch(getCountStatus(project))
            .unwrap()
            .then(async (response) => response.map((item) => {
                total = total + parseInt(item.count)
            })).then(() => {
                setTotalDefect(total)
            }
            )
    }, [project]);

    const tableBodyCell = () => {
        let content = [];
        for (let index = 0; index < report.ylabel.length; index++) {
            const label = report.ylabel[index]
            const value = report.yvalue[index]

            content.push(<TableRow>
                <TableCell>{label}</TableCell>
                <TableCell>{value}</TableCell>
            </TableRow>)
        }
        return content
    };


    return (
        <Box>

            {!selectedProject ?
                <Box>
                    <Typography variant='h5' sx={{ marginTop: '2rem' }}>Select a project to generate report</Typography>


                    <FormControl
                        fullWidth
                        sx={{ marginTop: '1rem' }}>


                        <InputLabel>Project</InputLabel>
                        <Select
                            name='project'
                            label='Project'
                            sx={{ width: '50%' }}
                            onChange={handleProject}

                        >
                            {defects.data.project ? defects.data.project.map((item) => (
                                <MenuItem
                                    key={item.title}
                                    value={item.title}
                                >{item.title}</MenuItem>
                            )
                            ) : null}

                        </Select>

                    </FormControl>
                </Box>
                : null}


            {!selectedProject ? null :
                <Grid container spacing={{ xs: 5, md: 2 }} columns={{ xs: 1, sm: 3, md: 8 }}>

                    {/* Filter container */}
                    <Button
                        variant='contained'
                        onClick={() => setShowFilter(true)}
                        sx={{mt:5}}
                    >Show Filter</Button>

                    <Drawer
                        anchor='left'
                        open={showFilter}
                        onClose={() => setShowFilter(false)}>


                        <Box
                            className='reportFilterContainer'
                            sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', border: '1px solid black', padding: '30px' }}>


                            <Typography variant='h5' mb={2} textAlign={'center'}>Select project</Typography>
                            <FormControl sx={{ mb: 5 }}>
                                <InputLabel>Project</InputLabel>
                                <Select
                                    name='project'
                                    label='Project'
                                    onChange={handleProject}
                                    defaultValue={project}
                                    value={project ?? project}

                                >
                                    {defects.data.project ? defects.data.project.map((item) => (
                                        <MenuItem
                                            key={item.title}
                                            value={item.title}
                                        >{item.title}</MenuItem>
                                    )
                                    ) : null}

                                </Select>
                            </FormControl>
                            <Divider />
                            <Typography variant='h5' textAlign={'center'} mb={2}>Chart Filter</Typography>
                            {/* Filter */}
                            <FormControl sx={{ mb: 2 }}>
                                <FormLabel>Chart type</FormLabel>
                                <RadioGroup
                                    row
                                    onChange={handleChartType}
                                    defaultValue={chartType}
                                >
                                    <FormControlLabel
                                        value='pie'
                                        control={<Radio />
                                        } label='Pie'
                                    />
                                    <FormControlLabel value='bar' control={<Radio />} label='Bar' />
                                </RadioGroup>
                            </FormControl>

                            <FormControl sx={{ width: '200px', mb: 3 }}>
                                <InputLabel>Chart</InputLabel>
                                <Select
                                    name="xaxis"
                                    label="X-Axis"
                                    value={report.xselect ?? 'status'}
                                    onChange={(e) => {
                                        handleXAxis(e)
                                        generateChart(e)
                                    }}
                                >
                                    <MenuItem
                                        key="server"
                                        value="server"
                                    >Server
                                    </MenuItem>

                                    <MenuItem
                                        key="issuetype"
                                        value="issuetype"
                                    >Issue Type
                                    </MenuItem>

                                    <MenuItem
                                        key="severity"
                                        value="severity"
                                    >Severity
                                    </MenuItem>

                                    <MenuItem
                                        key="status"
                                        value="status"
                                    >Status
                                    </MenuItem>

                                    <MenuItem
                                        key="components"
                                        value="components"
                                    >components
                                    </MenuItem>

                                </Select>
                            </FormControl>
                            <Divider></Divider>
                            <Typography variant='h5' textAlign={'center'} mt={3} mb={3}>Table Filter</Typography>

                            <FormControl sx={{ width: '200px', float: 'right' }}>
                                <InputLabel>Table</InputLabel>
                                <Select
                                    name="yaxis"
                                    label="Y-Axis"
                                    value={report.yselect ?? ""}
                                    onChange={(e)=>{
                                        handleYAxis(e)
                                        generateChart(e)
                                    }}
                                >
                                    <MenuItem
                                        key="server"
                                        value="server">
                                        Server
                                    </MenuItem>

                                    <MenuItem
                                        key="issuetype"
                                        value="issuetype">
                                        Issue Type
                                    </MenuItem>

                                    <MenuItem
                                        key="severity"
                                        value="severity">
                                        Severity
                                    </MenuItem>

                                    <MenuItem
                                        key="status"
                                        value="status">
                                        Status
                                    </MenuItem>

                                    <MenuItem
                                        key="components"
                                        value="components"
                                    >components
                                    </MenuItem>

                                </Select>
                            </FormControl>


                        </Box>

                    </Drawer>

                    <Grid item xs={1} sm={1} md={8}>
                        <Typography variant='h3' textAlign={'center'}>{project}</Typography>
                    </Grid>

                    <Grid item xs={1} sm={1} md={4}>
                        <Box
                            sx={{ width: 'fit-content', height: '400px', mt: 5, mb: 5 }}>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>

                            </Box>

                            {chartType === 'pie' && report.xselect ?
                                <Doughnut
                                    title='Defects'
                                    data={{
                                        labels: report.xlabel,
                                        datasets: [{
                                            data: report.xvalue,
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                            ]
                                        }],
                                    }}
                                    height={300}
                                    width={300}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Defects'
                                            },
                                            legend: {
                                                position: 'bottom',
                                            },
                                        }
                                    }}

                                />
                                :
                                null
                            }
                            {chartType === 'bar' && report.xselect ?
                                <Bar
                                    data={{
                                        labels: report.xlabel,
                                        datasets: [{
                                            label: 'Defects',
                                            data: report.xvalue,
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgb(255, 99, 132)',
                                                'rgb(255, 159, 64)',
                                                'rgb(255, 205, 86)',
                                                'rgb(75, 192, 192)',
                                                'rgb(54, 162, 235)',
                                                'rgb(153, 102, 255)',
                                                'rgb(201, 203, 207)'
                                            ],
                                        }],

                                        borderWidth: 1
                                    }}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    stepSize: 1
                                                }
                                            }
                                        }
                                    }
                                    }
                                    height={300}
                                    width={300}
                                />
                                :
                                null
                            }
                        </Box>

                    </Grid>

                    {/* TABLE */}
                    <Grid item xs={1} sm={1} md={4}>
                        <Box height={500} mt={5}>

                            <Typography variant='h6' mt={4}>Total Bug: {totalDefect}</Typography>

                            {report.xlabel ?
                                <Box>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell variant='head'>
                                                    {report.yselect.toUpperCase()}
                                                </TableCell>
                                                <TableCell variant='head'>
                                                   COUNT
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {tableBodyCell()}
                                        </TableBody>

                                    </Table>

                                </Box>
                                :
                                null
                            }
                        </Box>
                    </Grid>








                </Grid>

            }

        </Box >


    )

}

export default Report