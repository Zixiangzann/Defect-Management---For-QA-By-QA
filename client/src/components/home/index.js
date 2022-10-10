//comp

//mui
import Box from "@mui/material/Box";



//react grid layou
import { Responsive, WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"


const containerStyle = {
    backgroundColor: 'teal'
}


const ResponsiveGridLayout = WidthProvider(Responsive);

const Home = () => {

    return (
        <Box className='grid-container'>
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 996, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 8, md: 8, sm: 6, xs: 4, xxs: 2 }}
            >
                <Box key="a"
                sx={containerStyle} 
                data-grid={{ x: 0, y: 0, w: 4, h: 2 }}>
                    a
                </Box>

                <Box key="b"
                sx={containerStyle} 
                data-grid={{ x: 4, y: 0, w: 4, h: 2 }}>
                    b
                </Box>

                <Box key="c"
                sx={containerStyle} 
                data-grid={{ x: 0, y: 0, w: 4, h: 2 }}>
                    c
                </Box>

            </ResponsiveGridLayout>
        </Box>
    )

}

export default Home;