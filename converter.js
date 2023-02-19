const fs = require("fs");
const { runInNewContext } = require("vm");
const PNG = require("pngjs").PNG;

let grid = [];


function getPixelBrightness(pixel) {
    // Calculate the grayscale value using the Luma method
    const brightness = 0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2];
    return brightness;
}


// Read the PNG image from file
fs.createReadStream("creeper.png")
    .pipe(new PNG())
    .on("parsed", function () {
        // Loop over each pixel and log its RGB values
        let max = 0;
        for (let y = 0; y < this.height; y++) {
            let row = [];
            for (let x = 0; x < this.width; x++) {
                const idx = (this.width * y + x) << 2;
                const r = this.data[idx + 0];
                const g = this.data[idx + 1];
                const b = this.data[idx + 2];
                const brightness = getPixelBrightness([r, g, b]);
                const value = Math.max(brightness / 218);
                max = Math.max(max, value);
                row.push(value);
            }
            grid.push(row);
        }

        fs.writeFileSync('creeper.json', JSON.stringify(grid, null, 2))
        console.log({ max });


        const png = new PNG({ width: grid[0].length, height: grid.length });

        // Set the pixel data for the image
        for (let y = 0; y < png.height; y++) {
            for (let x = 0; x < png.width; x++) {
                const idx = (png.width * y + x) << 2;
                let value = grid[y][x] * (255);
                png.data[idx] = 0; // R
                png.data[idx + 1] = value; // G
                png.data[idx + 2] = 0; // B
                png.data[idx + 3] = 255; // A
            }
        }

        // Pipe the PNG object to a file stream
        png.pack()
            .pipe(fs.createWriteStream("image.png"))
            .on("finish", function () {
                console.log("Image saved.");
            });


    })
    .on("error", function (err) {
        console.log(err);
    })