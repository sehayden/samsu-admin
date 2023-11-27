export function getRandomDate() {
    var startDate = new Date(2020, 0, 1);  // start date (January 1, 2020)
    var endDate = new Date();  // end date (current date)
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}

export function isImageFile(filename) {
    // List of valid image file extensions
    var extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    
    // Get the file extension
    var fileExtension = filename.split('.').pop().toLowerCase();
    
    // Check if the file extension is in the list of image file extensions
    return extensions.includes(fileExtension);
}

export function getRandomName(names: string[]): string {
    // Get the length of the array
    let length = names.length;
    // Generate a random index between 0 and length - 1
    let index = Math.floor(Math.random() * length);
    // Return the name at that index
    return names[index];
  }

export function convertMillisToTime(millis) {
    let totalSeconds = millis / 1000;
    let totalMinutes = Math.floor(totalSeconds / 60);
    let totalHours = Math.floor(totalMinutes / 60);
  
    let seconds = Math.floor(totalSeconds % 60);
    let minutes = Math.floor(totalMinutes % 60);
    let hours = totalHours;
  
    return { hours, minutes, seconds };
  }
  