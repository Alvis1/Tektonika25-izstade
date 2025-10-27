/**
 * A-Frame Lightmap Component
 * 
 * Compatible with A-Frame 1.7 and Three.js r173
 * 
 * Usage:
 * Assign to GLB objects with lightmap data
 * lightmap__YourName="texture: #IDOfImageASSET; key: NameOfMaterial"
 * 
 * Requirements:
 * - A second UV map (uv1) for the 3D model
 * - Lightmap texture asset loaded in A-Frame scene
 * - Material name matching the key parameter
 */

AFRAME.registerComponent("lightmap", {
    multiple: true,
    schema: {
        texture: { type: "asset", default: "" },
        key: { type: "string", default: "" },
    },
    init: function () {
        var self = this;

        // console.log(
        //     "lightmap component initialized",
        //     self.data.texture,
        //     self.data.key
        // );

        // Create texture properly for r173
        self.lightMap = new THREE.Texture();
        self.lightMap.image = self.data.texture;
        self.lightMap.flipY = false;
        
        // Set channel for lightmap UV coordinates (channel 1 = uv1)
        self.lightMap.channel = 1;
        
        // Ensure texture is marked for update
        self.lightMap.needsUpdate = true;

        self.el.addEventListener("model-loaded", () => {
            var obj = self.el.object3D;
            obj.traverse((node) => {
                if (node.type == "Mesh") {
                    var matArguments = node.material.name.split("|");

                    matArguments.forEach((element) => {
                        if (element == self.data.key) {
                            // Set lightmap from a-frame asset
                            node.material.lightMap = self.lightMap;
                            node.material.lightMapIntensity = 1;
                            
                            // Force material update for r173 compatibility
                            node.material.needsUpdate = true;
                            
                            // Ensure texture is ready
                            if (node.material.lightMap) {
                                node.material.lightMap.needsUpdate = true;
                            }

                            // Optional: white clay model
                            // node.material.map = null;
                            // node.material.normalMap = null;
                            // node.material.lightMapIntensity = 1;
                            // node.material.color = new THREE.Color( 0xffffff );
                        }
                    });
                }
            });
        });
    },
});
