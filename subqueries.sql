--Problem 1 -- Get all invoices where the unit_price on the invoice_line is greater than $0.99.
select i.invoice_id, il.unit_price
from invoice i
join invoice_line il
on i.invoice_id = il.invoice_id
where il.unit_price > .99;

--Problem 2 -- Get all playlist tracks where the playlist name is Music.
select distinct(pt.track_id),t.name,p.name
from playlist p
join playlist_track pt
on p.playlist_id = pt.playlist_id
join track t
on pt.track_id = t.track_id
where p.name = 'Music';

--Problem 3 -- Get all track names for playlist_id 5.
select p.playlist_id,t.name,p.name
from playlist p
join playlist_track pt
on p.playlist_id = pt.playlist_id
join track t
on pt.track_id = t.track_id
where p.playlist_id = 5;

--Problem 4 -- Get all tracks where the genre is Comedy.
select p.name playlist_name, t.name track_name, g.name
from playlist p
join playlist_track pt
on p.playlist_id = pt.playlist_id
join track t
on pt.track_id = t.track_id
join genre g
on g.genre_id = t.genre_id
where g.name = 'Comedy';

--Problem 5 -- Get all tracks where the album is Fireball.
select t.track_id, a.title, a.album_id
from track t
join album a
on a.album_id = t.track_id
where a.title = 'Fireball';


--Problem 6 -- Get all tracks for the artist Queen ( 2 nested subqueries ).
select name, track_id, composer
from track
where album_id in(select album_id
				  from album
				    where artist_id = (

                                        select artist_id
                                        from artist
                                        where name = 'Queen'
                                                                ));