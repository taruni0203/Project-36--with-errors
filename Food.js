class Food{
    constructor(){
        this.image = loadImage("images/Milk.png");
        this.foodStock = null;
        this.lastFed = null;
    }
   
    bedroom(){
        background(bedroom,700,500);
    }
    garden(){
        //console.log("hi")
        background(garden,700,500);
    }
    washroom(){
        background(washroom,700,500);
    }

    getFoodStock(){
        var foodStockRef = database.ref("food");
        foodStockRef.on("value",(data)=>{
            this.foodStock = data.val();
        })
    }
    updateFoodStock(){
        if(this.foodStock >=30){
            this.foodStock = 30;
          }
          else{
            this.foodStock = this.foodStock+1;
          }
        
        database.ref('/').update({
            food: this.foodStock
        })
    }
    deductFood(){
        if(this.foodStock<=0){
            this.foodStock = 0;
          }
          else{
            this.foodStock = this.foodStock-1;
          }
        
          database.ref('/').update({
            food: this.foodStock,
          })
    }

    display(){
        this.visible = true;
        var x = 80, y = 100;
            //imageMode(CENTER);
            //image(this.image,720,220,70,70);
        
        if(this.foodStock > 0){
            for(var i = 0; i<this.foodStock; i++){
                if(i%10 === 0){
                    x = 80;
                    y = y + 50;
                }
                imageMode(CENTER);
                image(this.image,x,y,50,50);
                x = x + 30;
            }
        }
    }
}