import torch
from PIL import Image
from diffusers import StableDiffusionControlNetImg2ImgPipeline
from diffusers import ControlNetModel
from diffusers import DDIMScheduler
from diffusers.utils import load_image

controlnet = ControlNetModel.from_pretrained("DionTimmer/controlnet_qrcode-control_v1p_sd15", torch_dtype=torch.float16)

pipe = StableDiffusionControlNetImg2ImgPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    controlnet=controlnet,
    torch_dtype=torch.float16)



pipe.enable_xformers_memory_efficient_attention()
pipe.scheduler = DDIMScheduler.from_config(pipe.scheduler.config)
pipe.enable_model_cpu_offload()

def resize_image(input_image: Image, resolution: int):
  input_image = input_image.convert("RGB")
  W, H = input_image.size
  k = float(resolution) / min(H, W)
  H *= k
  W *= k
  H = int(round(H /64.0)) * 64
  W = int(round(W / 64.0)) *64
  img = input_image.resize((W, H), resample=Image.LANCZOS)
  return img

source_image = load_image("https://drive.google.com/uc?id=1c-dXBR_lfprDYY2ZaVBBZa2z3Eov6OmS")
init_image = load_image("https://drive.google.com/uc?id=1c-dXBR_lfprDYY2ZaVBBZa2z3Eov6OmS")
condition_image = resize_image(source_image, 512)
init_image = resize_image(init_image, 512)
generator = torch.manual_seed(123121231)

image = pipe(prompt="a girl siting in a coffee shop reading book",
             negative_prompt="ugly, disfigured, low quality, blurry",
             image=init_image,
             control_image=condition_image,
             width=512,
             height=512,
             #Higher guidance scale encourages to generate images that are closely linked to the text prompt
             guidance_scale=20,
             #more the weight more the importance for the qr code
             controlnet_conditioning_scale=1.5,
             generator=generator,
             #the weight given to the text prompt
             strength=0.9,
             #The number of denoising steps. More denoising steps usually lead to a higher quality image at the expense of slower inference.
             num_inference_steps=150)

image.images[0]