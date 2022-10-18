//comp
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../utils/tools';

//mui
import Grid2 from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import OpenWithIcon from '@mui/icons-material/OpenWith';

import Box from "@mui/material/Box";
import Watchlist from "./gadgets/watchlist";

//react grid layout
import { Responsive, WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import { useEffect, useState } from 'react';
import { Divider } from '@mui/material';
import HeightIcon from '@mui/icons-material/Height';
import { setSavedLayout } from '../../store/reducers/watchlist';
import { getWatchlist, updateLayout } from '../../store/actions/watchlist';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const ResponsiveGridLayout = WidthProvider(Responsive);


const Home = () => {

    const dispatch = useDispatch();

    const savedLayout = useSelector(state => state.watchlist.savedLayout)

    const [layouts, setLayouts] = useState({})
    const [dragged, setDragged] = useState(false)
    const [resized, setResized] = useState(false)
    const [loading, setLoading] = useState(true)

    const handleLayout = (layout, layouts) => {
        setLayouts(layouts)
    }

    const handleDragged = () => {
        setDragged(true)
    }

    const handleResized = () => {
        setResized(true)
    }

    useEffect(() => {
        dispatch(getWatchlist())
        .unwrap()
        .then(() => {
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (dragged || resized) {
            dispatch(updateLayout(layouts))
                .unwrap()
                .then(() => {
                    setDragged(false)
                    setResized(false)
                })
        }
    }, [layouts])



    return (
        <Box sx={{ width: '100%', marginTop: '5rem' }}>

            <Loader
                loading={loading}
            />

            <ResponsiveGridLayout
                className="layout"
                layouts={savedLayout}
                draggableHandle='.drag-handle'
                resizeHandles={['ne', 'se']}
                breakpoints={{ md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ md: 8, sm: 6, xs: 4, xxs: 2 }}
                onLayoutChange={(layout, layouts) => { handleLayout(layout, layouts) }}
                onDragStop={handleDragged}
                onResizeStop={handleResized}
            >

                <Item
                    key="a"
                    data-grid={{ x: 0, y: 0, w: 4, h: 2, minW: 4, minH: 2 }}
                >

                    <Box
                        className="drag-handle"
                        m={1}
                        sx={{ display: 'flex', justifyContent: 'flex-start', height: '1rem' }}
                    >


                    </Box>


                    <Divider m={3}></Divider>

                    <Watchlist></Watchlist>

                </Item>


            </ResponsiveGridLayout>

        </Box >
    )

}

export default Home;