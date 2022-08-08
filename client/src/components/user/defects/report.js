import { Doughnut, Bar, Chart} from 'react-chartjs-2';

import { Chart as ChartJS, ArcElement, plugins, LinearScale, CategoryScale, BarController, BarElement} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

//comp
import { getCountComponents, getCountIssueType, getCountServer, getCountSeverity, getCountStatus, getDefectId } from '../../../store/actions/report'
import { setXSelect, setYSelect, resetReportState } from '../../../store/reducers/report';
import { getAllProjects } from '../../../store/actions/defects';
import Moment from 'react-moment';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas'

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
import { Icon, IconButton, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button'
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import Table from '@mui/material/Table';
import { DataGrid } from '@material-ui/data-grid'
import Drawer from '@mui/material/Drawer';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PictureAsPdf from '@mui/icons-material/PictureAsPdf';

ChartJS.register(ArcElement, plugins, LinearScale, CategoryScale, BarController, BarElement, LinearScale, ChartDataLabels);
ChartJS.register({
    id: "custom_canvas_background_color",
    beforeDraw: (chart)=>{
        const {ctx} = chart;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, chart.width, chart.height);
    }
})


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

    //export report to pdf
        const generatePDF = async() => {
            const reportArea = document.getElementById('report')
            const reportTitle = document.getElementById('report-title')
            const reportDate = document.getElementById('report-date')
            const reportChart = document.getElementById('report-chart')
            const reportTable = document.getElementById('report-table')
    
            const report = new JsPDF('landscape','mm','a4');
            var width = report.internal.pageSize.getWidth();
            var height = report.internal.pageSize.getHeight();


            report.setFontSize(24)
            report.text(project, width*0.5,height*0.1, 'center');
            report.setFontSize(15)
            report.text(`Total Bug: ${totalDefect.toString()}`, width*0.5,height*0.2, 'center');

            const chartImgData = (await html2canvas(reportChart)).toDataURL('image/jpeg');
            report.addImage(chartImgData,'JPEG',width*0.1,height*0.3,width*0.4,height*0.6)


            const tableImgData = (await html2canvas(reportTable)).toDataURL('image/jpeg');
            report.addImage(tableImgData,'JPEG',width*0.5,height*0.3,width*0.4,height*0.6)

            report.setFontSize(8)
            report.text(`Report Generated on: ${Date().toString()}`,width*0.6,height*0.9)


            report.save(`${project}_${Date().toString().replace(/\s/g,'_').replace(/:/g,'_')}`)
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
        dispatch(getDefectId({ project }));
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
                <Box>
                    {/* Filter container */}
                    <Button
                        variant='outlined'
                        onClick={() => setShowFilter(true)}
                        sx={{ m: 10 }}
                    >Open Menu</Button>
                    

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
                                    onChange={(e) => {
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

                        <Button
                                variant="outlined"
                                color="secondary"
                                aria-label="download report as pdf"
                                sx={{m:1}}
                                onClick={generatePDF}
                                startIcon={<PictureAsPdf />}>
                                Download report as pdf
                            </Button>

                    </Drawer>
                           <Grid container spacing={{ xs: 5, md: 5 }} columns={{ xs: 1, sm: 1, md: 8 }}
                    id='report'
                   >
             
    

                    <Grid item xs={1} sm={1} md={8} id='report-title'>                    
                        <Typography variant='h3' textAlign={'center'}>{project}</Typography>
                        <Typography variant='h5' mt={4} mb={4} textAlign={'center'}>Total Bug: {totalDefect}</Typography>
                    </Grid>
                   

                    <Grid item xs={1} sm={1} md={4}>
                        <Box
                            id='report-chart'
                            sx={{ width: '400px', height: '400px', mt: 5, mb: 5 }}>

          

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
                                            animation: {
                                                duration: 0,
                                            },
                                            datalabels: {
                                                color: 'blue',
                                                labels: {
                                                    title: {
                                                        font: {
                                                            weight: 'bold'
                                                        }
                                                    },
                                                    value: {
                                                        color: 'green'
                                                    }
                                                }
                                            }
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
                                        },
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            animation: {
                                                duration: 0,
                                            },
                                            datalabels: {
                                                color: 'blue',
                                                labels: {
                                                    title: {
                                                        font: {
                                                            weight: 'bold'
                                                        }
                                                    },
                                                    value: {
                                                        color: 'green'
                                                    }
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
                    <Grid item xs={1} sm={1} md={4} id='report-table'>
                        <Box height={500} mt={5}>



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
                    
                    {/* <Typography id='report-date'variant='h7' sx={{
                        position: 'relative'
                        , left: '75%'
                    }}>Report Generated on: <Moment format="DD/MMM/YYYY , HH:MM:SS">{Date.now()}</Moment></Typography>
         */}
                </Grid>
                </Box>
                
                
                
            }
            
            
        </Box >

    )
    
    
    
}



export default Report