
class ImageUtil {
    public imageFileType(fileName: string): boolean {
        if(!fileName) return false;

        const extensions = [".jpg", ".jpeg", ".gif", ".bmp", ".webp", "tiff", "heif", "svg"];
        
        for(const extension of extensions){
            if(fileName.toLowerCase().endsWith(extension)) return true;
        return false;
        }
    }
};
export const imageUtil = new ImageUtil();